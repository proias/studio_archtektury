const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
require("./register.cjs");
const {
  projects,
  featuredProjects,
  portfolioProjects,
  categories,
} = require("../lib/projects.ts");
const manifest = require("../lib/image-manifest.json");
const catalog = require("../lib/project-catalog.json");
test("nowy katalog ma 12 unikalnych projektów i sześć właściwych wyróżnień", () => {
  assert.equal(projects.length, 12);
  assert.equal(new Set(projects.map((p) => p.slug)).size, 12);
  assert.equal(new Set(catalog.map((p) => p.sourceFolder)).size, 12);
  assert.deepEqual(
    featuredProjects.map((p) => p.slug),
    [
      "dom-lodzkie-3",
      "dom-mazowieckie",
      "agroturystyka-lodzkie",
      "dom-lodzkie",
      "kuchnia-1",
      "lazienka",
    ],
  );
  for (const p of projects) {
    assert.match(p.slug, /^[a-z0-9-]+$/);
    assert.ok(categories.includes(p.category));
    assert.equal(p.cover.src, p.images[0].src);
    assert.equal(p.year, undefined);
    assert.equal(p.location, undefined);
    assert.equal(p.description, "");
  }
});
test("41 obrazów z nowych folderów zachowuje rozdzielczość i ma opis", async () => {
  const sharp = require("sharp");
  assert.equal(manifest.length, 41);
  assert.equal(
    projects.reduce((n, p) => n + p.images.length, 0),
    41,
  );
  for (const image of manifest) {
    const actual = await sharp(
      path.join(__dirname, "../public", image.src),
    ).metadata();
    assert.equal(actual.width, image.width);
    assert.equal(actual.height, image.height);
    assert.ok(image.alt.length > 30);
    assert.ok(image.bytes < image.sourceBytes);
    assert.match(image.sha256, /^[a-f0-9]{64}$/);
    const project = catalog.find((p) => p.imageSources.includes(image.src));
    assert.ok(project);
    assert.ok(image.source.startsWith(project.sourceFolder + "/"));
  }
});
test("nierozstrzygnięte archiwum nie trafia do głównego portfolio", () => {
  assert.equal(portfolioProjects.length, 11);
  assert.ok(!portfolioProjects.some((p) => p.slug === "dom-kostka-przebudowa"));
  assert.equal(
    projects.find((p) => p.slug === "dom-kostka-przebudowa").publicationStatus,
    "pending-confirmation",
  );
  assert.ok(
    projects.every((p) => p.credits.authorship === "pending-confirmation"),
  );
  assert.equal(require("../docs/legacy-projects.json").length, 3);
});

test("szeroka okładka domu na Mazowszu zachowuje cały kadr", () => {
  assert.equal(
    projects.find((p) => p.slug === "dom-mazowieckie").cover.objectFit,
    "contain",
  );
});
