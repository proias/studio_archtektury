const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
require("./register.cjs");
const { getPreviewOrigin } = require("../lib/deployment.ts");
test("adres udostępniania używa adresu podglądu Netlify bez ścieżki", () => {
  assert.equal(
    getPreviewOrigin({
      DEPLOY_PRIME_URL:
        "https://deploy-preview-7--cywinska-studio.netlify.app/path",
      URL: "https://cywinska-studio.pl",
    }),
    "https://deploy-preview-7--cywinska-studio.netlify.app",
  );
  assert.equal(getPreviewOrigin({}), "http://localhost:3000");
  assert.throws(() => getPreviewOrigin({ URL: "javascript:alert(1)" }));
  assert.throws(() =>
    getPreviewOrigin({ URL: "https://user:password@example.test" }),
  );
});
test("build Netlify nie pozwala na przypadkową publikację produkcyjną", () => {
  const result = spawnSync(process.execPath, ["scripts/netlify-build.mjs"], {
    encoding: "utf8",
    env: { ...process.env, CONTEXT: "production" },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Publikacja produkcyjna jest zablokowana/);
});
test("definicja Netlify Forms zawiera wszystkie pola i pułapkę na spam", () => {
  const form = fs.readFileSync("public/__forms.html", "utf8");
  for (const name of [
    "name",
    "email",
    "phone",
    "projectType",
    "message",
    "form-name",
    "bot-field",
  ])
    assert.ok(form.includes('name="' + name + '"'));
  assert.ok(form.includes('data-netlify="true"'));
  assert.ok(form.includes('netlify-honeypot="bot-field"'));
});
