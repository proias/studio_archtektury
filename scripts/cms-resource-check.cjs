// Lightweight check: no webpack, server or browser process.
require("../tests/register.cjs");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const sharp = require("sharp");
let reads = 0,
  active = 0,
  peak = 0;
const metadata = sharp.prototype.metadata;
sharp.prototype.metadata = async function (...args) {
  reads++;
  peak = Math.max(peak, ++active);
  try {
    return await metadata.apply(this, args);
  } finally {
    active--;
  }
};
(async () => {
  const cms = require("../lib/cms/reader.ts");
  const slugs = await cms.getProjectSlugs();
  await cms.getPortfolioNavigation();
  assert.equal(
    reads,
    0,
    "Slugs and next-project navigation must not inspect images",
  );
  const projects = await cms.getAllProjects();
  const unique = new Set(
    projects.flatMap((project) => [
      project.cover.src,
      ...project.images.map((image) => image.src),
    ]),
  ).size;
  assert.equal(reads, unique, "Each file must be inspected only once");
  await cms.getAllProjects();
  await cms.getFeaturedProjects();
  await cms.getPrimaryCover();
  assert.equal(reads, unique, "Repeated reads must reuse dimensions");
  assert.equal(peak, 1, "Native metadata reads must be serialized");
  const result = {
    projects: slugs.length,
    uniqueImages: unique,
    nativeMetadataReads: reads,
    maxConcurrentNativeReads: peak,
    peakProcessRSSMiB: Math.round(process.resourceUsage().maxRSS / 1024),
  };
  fs.writeFileSync(
    "docs/qa-cms/resources.json",
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result, null, 2));
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    sharp.prototype.metadata = metadata;
  });
