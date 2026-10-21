// Exercise the actual Next route exports without webpack or Chrome.
process.env.NODE_ENV = "development";
require("../tests/register.cjs");
const fs = require("node:fs/promises");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { GET, POST } = require("../app/api/keystatic/[...params]/route.ts");
const { reader } = require("../lib/cms/reader.ts");
const filename = "content/site.json";
const base = "http://127.0.0.1:3000/api/keystatic";
const checks = [];
const sha = (data) =>
  crypto
    .createHash("sha1")
    .update(`blob ${data.length}\0`)
    .update(data)
    .digest("hex");
const update = (additions) =>
  POST(
    new Request(base + "/update", {
      method: "POST",
      headers: { "content-type": "application/json", "no-cors": "1" },
      body: JSON.stringify({ additions, deletions: [] }),
    }),
  );
const check = (name, condition) => {
  assert.ok(condition, name);
  checks.push(name);
  console.log("OK", name);
};
(async () => {
  const original = await fs.readFile(filename);
  let changed = false;
  try {
    const denied = await GET(new Request(base + "/tree"));
    check("local API requires no-cors header", denied.status === 400);
    const tree = await GET(
      new Request(base + "/tree", { headers: { "no-cors": "1" } }),
    );
    check(
      "CMS tree lists site and projects",
      tree.status === 200 && (await tree.text()).includes("content/site.json"),
    );
    const bad = await update([
      {
        path: "../cms-must-not-write.txt",
        contents: Buffer.from("test").toString("base64url"),
      },
    ]);
    check("CMS rejects paths outside allowed directories", bad.status === 400);
    const site = JSON.parse(original);
    site.title += " — API QA";
    const content = Buffer.from(JSON.stringify(site, null, 2) + "\n");
    changed = true;
    const saved = await update([
      { path: filename, contents: content.toString("base64url") },
    ]);
    check("CMS writes singleton", saved.status === 200);
    check(
      "Reader sees saved content",
      (await reader.singletons.site.read()).title === site.title,
    );
    const blob = await GET(
      new Request(base + "/blob/" + sha(content) + "/" + filename, {
        headers: { "no-cors": "1" },
      }),
    );
    check(
      "CMS reads saved blob",
      blob.status === 200 &&
        Buffer.from(await blob.arrayBuffer()).equals(content),
    );
    const restored = await update([
      { path: filename, contents: original.toString("base64url") },
    ]);
    check(
      "CMS restores exact original bytes",
      restored.status === 200 && (await fs.readFile(filename)).equals(original),
    );
    changed = false;
    process.env.NODE_ENV = "production";
    try {
      check(
        "production refuses unauthenticated local reads",
        (
          await GET(
            new Request(base + "/tree", { headers: { "no-cors": "1" } }),
          )
        ).status === 503,
      );
      check(
        "production refuses unauthenticated local writes",
        (
          await update([
            { path: filename, contents: original.toString("base64url") },
          ])
        ).status === 503,
      );
    } finally {
      process.env.NODE_ENV = "development";
    }
    await fs.writeFile(
      "docs/qa-cms/cms-api-results.json",
      JSON.stringify({ passed: checks.length, checks }, null, 2) + "\n",
    );
  } finally {
    if (changed) await fs.writeFile(filename, original);
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
