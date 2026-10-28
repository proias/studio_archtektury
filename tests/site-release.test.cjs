const { test } = require("node:test");
const assert = require("node:assert/strict");
require("./register.cjs");
const { canonicalUrl } = require("../lib/deployment.ts");
const { indexingEnabled } = require("../lib/indexing-policy.mjs");
const { validateRedirects, loadRedirects } = require("../lib/redirects.mjs");
const robots = require("../app/robots.ts").default;
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
test("globalne nagłówki ograniczają HTTPS, uprawnienia przeglądarki i typy treści", async () => {
  const { default: nextConfig } = await import("../next.config.mjs");
  const rules = await nextConfig.headers();
  const global = rules.find((rule) => rule.source === "/:path*").headers;
  const headers = Object.fromEntries(
    global.map(({ key, value }) => [key, value]),
  );
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.equal(headers["Strict-Transport-Security"], "max-age=31536000");
  assert.equal(
    headers["Permissions-Policy"],
    "camera=(), microphone=(), geolocation=()",
  );
});
test("robots zezwala na indeksowanie tylko w zatwierdzonej produkcji", () => {
  const original = {
    context: process.env.CONTEXT,
    enabled: process.env.SITE_INDEXING_ENABLED,
  };
  try {
    process.env.CONTEXT = "production";
    process.env.SITE_INDEXING_ENABLED = "true";
    assert.deepEqual(robots(), {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/keystatic", "/cms-preview", "/api/", "/__forms.html"],
      },
      sitemap: "https://cywinska-studio.pl/sitemap.xml",
    });
    process.env.CONTEXT = "deploy-preview";
    assert.deepEqual(robots(), {
      rules: { userAgent: "*", disallow: "/" },
    });
  } finally {
    if (original.context === undefined) delete process.env.CONTEXT;
    else process.env.CONTEXT = original.context;
    if (original.enabled === undefined)
      delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = original.enabled;
  }
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
        "https://cywinska-studio.pl/prywatnosc",
        "https://cywinska-studio.pl/regulamin",
        ...(await require("../lib/cms/reader.ts").getProjectSlugs()).map(
          (slug) => "https://cywinska-studio.pl/projekty/" + slug,
        ),
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
  assert.deepEqual(
    loadRedirects(),
    require("../content/redirects.json").entries.map((entry) => ({
      ...entry,
      permanent: true,
    })),
  );
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
  assert.deepEqual(
    await reader.singletons.site.read(),
    require("../content/site.json"),
  );
  assert.equal(
    (await reader.singletons.site.read()).postalAddress.addressCountry,
    "PL",
  );
});
