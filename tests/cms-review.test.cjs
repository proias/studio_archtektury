const { test } = require("node:test");
const assert = require("node:assert/strict");
require("./register.cjs");
const {
  readReviewState,
  validReviewBranch,
  validPreviewPath,
} = require("../lib/cms-review.ts");
const pr = {
  number: 7,
  state: "open",
  merged_at: null,
  head: { sha: "current" },
};
function replies(...data) {
  return async (url) => {
    assert.ok(
      url.startsWith("https://api.github.com/repos/proias/studio_archtektury/"),
    );
    assert.ok(data.length, "unexpected external request");
    return Response.json(data.shift());
  };
}
const status = (
  state,
  target_url = "https://deploy-preview-7--cywinska-studio.netlify.app",
) => ({
  sha: "current",
  statuses: [
    { context: "netlify/cywinska-studio/deploy-preview", state, target_url },
  ],
});

test("review validates branch and destination before any external request", async () => {
  for (const branch of ["main", "cms/../main", "cms/a?token=x", "cms/a//b"])
    assert.equal(validReviewBranch(branch), false);
  for (const path of [
    "//evil.test",
    "https://evil.test",
    "/api/keystatic",
    "/projekty/../main",
  ])
    assert.equal(validPreviewPath(path), false);
  await assert.rejects(
    readReviewState("main", "/", () => {
      throw Error("must not fetch");
    }),
    /gałąź/,
  );
});
test("review distinguishes missing PR, current build, and ready preview", async () => {
  assert.equal(
    (await readReviewState("cms/test", "/", replies([]))).state,
    "waiting",
  );
  const building = await readReviewState(
    "cms/test",
    "/",
    replies([pr], status("pending")),
  );
  assert.equal(building.state, "building");
  assert.equal(building.previewUrl, undefined);
  const ready = await readReviewState(
    "cms/test",
    "/projekty/dom-lodzkie-3",
    replies([pr], status("success")),
  );
  assert.equal(ready.state, "ready");
  assert.equal(
    ready.previewUrl,
    "https://deploy-preview-7--cywinska-studio.netlify.app/projekty/dom-lodzkie-3",
  );
});
test("review never advertises failed, stale or untrusted deploy as ready", async () => {
  const stale = { ...status("success"), sha: "old" };
  for (const data of [
    status("failure"),
    stale,
    status("success", "https://evil.test"),
    status("success", "https://cywinska-studio.pl"),
  ]) {
    const result = await readReviewState("cms/test", "/", replies([pr], data));
    assert.notEqual(result.state, "ready");
    assert.equal(result.previewUrl, undefined);
  }
});
test("review checks the current branch even when PR metadata lags behind Save", async () => {
  const urls = [];
  const values = [[{ ...pr, head: { sha: "previous" } }], status("success")];
  const result = await readReviewState("cms/test", "/", async (url) => {
    urls.push(url);
    return Response.json(values.shift());
  });
  assert.ok(urls[1].endsWith("commits/cms%2Ftest/status"));
  assert.equal(result.state, "building");
  assert.equal(result.head, "current");
  assert.equal(result.previewUrl, undefined);
});
test("review handles closed PR and rate limiting without retry loop", async () => {
  const closed = { ...pr, state: "closed" };
  assert.equal(
    (await readReviewState("cms/test", "/", replies([closed]))).state,
    "closed",
  );
  assert.equal(
    (
      await readReviewState(
        "cms/test",
        "/",
        replies([{ ...closed, merged_at: "2026-10-22" }]),
      )
    ).state,
    "merged",
  );
  await assert.rejects(
    readReviewState(
      "cms/test",
      "/",
      async () => new Response("", { status: 403 }),
    ),
    /ograniczył/,
  );
});
