const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
function script(name) {
  return fs
    .readFileSync(`.github/workflows/${name}.yml`, "utf8")
    .replace(/\r\n/g, "\n")
    .split("node <<'NODE'\n")[1]
    .split("\n          NODE")[0];
}
async function runReview(existing) {
  const calls = [];
  const process = {
    env: {
      GITHUB_REPOSITORY: "proias/studio_archtektury",
      GITHUB_REF_NAME: "cms/test",
      GH_TOKEN: "fixture",
      REVIEWER: "proias",
    },
    exitCode: 0,
  };
  await vm.runInNewContext(script("cms-review"), {
    process,
    console: {
      log() {},
      error(message) {
        throw Error(message);
      },
    },
    async fetch(url, options) {
      const route = url.split("studio_archtektury/")[1];
      calls.push({ route, method: options.method });
      const pr = {
        number: 7,
        head: { sha: "current" },
        html_url: "https://github.com/proias/studio_archtektury/pull/7",
        user: { login: "github-actions[bot]" },
        requested_reviewers: existing ? [{ login: "proias" }] : [],
      };
      let value;
      if (route.startsWith("pulls?")) value = existing ? [pr] : [];
      else if (route === "pulls" && options.method === "POST") value = pr;
      else if (route === "pulls/7/reviews" && options.method === "GET")
        value = [];
      else if (
        route === "pulls/7/requested_reviewers" &&
        options.method === "POST"
      )
        value = {};
      else throw Error("Unexpected operation: " + route);
      return { ok: true, status: 200, json: async () => value };
    },
  });
  assert.equal(process.exitCode, 0);
  return calls;
}
test("CMS workflow creates one PR, requests owner review and never approves or merges", async () => {
  const initial = await runReview(false);
  assert.equal(
    initial.filter((c) => c.route === "pulls" && c.method === "POST").length,
    1,
  );
  assert.equal(
    initial.filter((c) => c.route.endsWith("requested_reviewers")).length,
    1,
  );
  const repeat = await runReview(true);
  assert.equal(repeat.filter((c) => c.method === "POST").length, 0);
});
async function boundary(files, workflowRun = false) {
  const process = {
    env: {
      GITHUB_REPOSITORY: "proias/studio_archtektury",
      GITHUB_EVENT_PATH: "fixture",
      GH_TOKEN: "fixture",
    },
    exitCode: 0,
  };
  const errors = [];
  const statuses = [];
  const pr = { number: 7, head: { ref: "cms/test", sha: "current" } };
  await vm.runInNewContext(script("cms-content-boundary"), {
    process,
    console: {
      log() {},
      error(message) {
        errors.push(message);
      },
    },
    require(name) {
      assert.equal(name, "node:fs");
      return {
        readFileSync: () =>
          JSON.stringify({
            ...(workflowRun
              ? {
                  workflow_run: {
                    head_repository: { full_name: "proias/studio_archtektury" },
                    head_branch: "cms/test",
                    head_sha: "current",
                  },
                }
              : { pull_request: pr }),
          }),
      };
    },
    fetch: async (url, options) => {
      let data = files;
      if (url.includes("/pulls?")) data = [pr];
      if (url.includes("/statuses/current")) {
        statuses.push(JSON.parse(options.body).state);
        data = {};
      }
      return { ok: true, status: 200, json: async () => data };
    },
  });
  return { code: process.exitCode, errors, statuses };
}
test("trusted boundary permits content and raster images, rejects code and renamed code", async () => {
  assert.equal(
    (
      await boundary([
        { filename: "content/pages.json" },
        { filename: "public/images/site/hero/src.png" },
      ])
    ).code,
    0,
  );
  for (const file of [
    { filename: "app/page.tsx" },
    { filename: "public/images/site/unsafe.svg" },
    {
      filename: "content/pages.json",
      previous_filename: ".github/workflows/cms-review.yml",
    },
  ])
    assert.equal((await boundary([file])).code, 1);
});
test("trusted boundary also runs after bot-created PR and reports the exact head commit", async () => {
  const valid = await boundary([{ filename: "content/pages.json" }], true);
  assert.equal(valid.code, 0);
  assert.deepEqual(valid.statuses, ["success"]);
  const forbidden = await boundary([{ filename: "app/page.tsx" }], true);
  assert.equal(forbidden.code, 1);
  assert.deepEqual(forbidden.statuses, ["failure"]);
});
