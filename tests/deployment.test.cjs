const { test } = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
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
test("build Netlify uruchamia Next i przekazuje kod zakończenia dla każdego kontekstu", () => {
  const source = fs
    .readFileSync("scripts/netlify-build.mjs", "utf8")
    .replace(/^import .*;\r?\n/, "");
  for (const context of ["production", "deploy-preview"]) {
    for (const status of [0, 1, null]) {
      let exit;
      const env = { CONTEXT: context };
      vm.runInNewContext(source, {
        process: {
          execPath: "node",
          env,
          exit: (code) => {
            exit = code;
          },
        },
        spawnSync(executable, args, options) {
          assert.equal(executable, "node");
          assert.deepEqual(Array.from(args), [
            "node_modules/next/dist/bin/next",
            "build",
          ]);
          assert.equal(options.env, env);
          assert.equal(options.stdio, "inherit");
          return { status };
        },
      });
      assert.equal(exit, status ?? 1);
    }
  }
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
