const { test } = require("node:test");
const assert = require("node:assert/strict");
require("./register.cjs");
const { canonicalUrl } = require("../lib/deployment.ts");
const { indexingEnabled } = require("../lib/indexing-policy.mjs");
const { validateRedirects, loadRedirects } = require("../lib/redirects.mjs");
const sitemap = require("../app/sitemap.ts").default;

test("canonical jest produkcyjny, a indeksowanie wymaga jawnej zgody i kontekstu produkcji", () => {
  assert.equal(
    canonicalUrl("/projekty/dom-lodzkie-3"),
    "https://cywinska-studio.pl/projekty/dom-lodzkie-3",
  );
  assert.throws(() => canonicalUrl("//evil.test"));
  assert.equal(indexingEnabled({}), false);
  assert.equal(indexingEnabled({ CONTEXT: "production" }), false);
  assert.equal(
    indexingEnabled({
      CONTEXT: "deploy-preview",
      SITE_INDEXING_ENABLED: "true",
    }),
    false,
  );
  assert.equal(
    indexingEnabled({ CONTEXT: "production", SITE_INDEXING_ENABLED: "true" }),
    true,
  );
});
test("sitemap zawiera tylko docelowe publiczne adresy; podgląd nie emituje własnej mapy", async () => {
  const original = process.env.CONTEXT;
  try {
    process.env.CONTEXT = "production";
    assert.deepEqual(
      (await sitemap()).map((entry) => entry.url),
      [
        "https://cywinska-studio.pl/",
        "https://cywinska-studio.pl/projekty",
        "https://cywinska-studio.pl/projekty/dom-lodzkie-3",
      ],
    );
    process.env.CONTEXT = "deploy-preview";
    assert.deepEqual(await sitemap(), []);
  } finally {
    if (original === undefined) delete process.env.CONTEXT;
    else process.env.CONTEXT = original;
  }
});
test("przekierowania odrzucają pętle, łańcuchy, aktywne źródła, szkice i zewnętrzne cele", () => {
  const paths = ["/", "/projekty", "/projekty/dom-lodzkie-3"];
  assert.deepEqual(
    validateRedirects(
      [{ source: "/stary", destination: "/projekty/dom-lodzkie-3" }],
      paths,
    ),
    [
      {
        source: "/stary",
        destination: "/projekty/dom-lodzkie-3",
        permanent: true,
      },
    ],
  );
  for (const entries of [
    [{ source: "/projekty", destination: "/" }],
    [{ source: "/stary", destination: "/projekty/szkic" }],
    [{ source: "/stary", destination: "https://evil.test" }],
    [
      { source: "/stary", destination: "/inny" },
      { source: "/inny", destination: "/stary" },
    ],
    [
      { source: "/stary", destination: "/" },
      { source: "/stary", destination: "/projekty" },
    ],
    [{ source: "/keystatic/x", destination: "/api/x" }],
  ])
    assert.throws(() => validateRedirects(entries, paths));
  assert.deepEqual(loadRedirects(), []);
});
test("nowe singletony są czytelne dla Keystatic i zachowują teksty startowe", async () => {
  const { reader } = require("../lib/cms/reader.ts");
  assert.deepEqual(
    await reader.singletons.pages.read(),
    require("../content/pages.json"),
  );
  assert.deepEqual(
    await reader.singletons.redirects.read(),
    require("../content/redirects.json"),
  );
});
