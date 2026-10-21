const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
require("./register.cjs");
const { categories } = require("../lib/projects.ts");
const {
  getAllProjects,
  getProjectBySlug,
  selectFeaturedProjects,
  selectPortfolioProjects,
  reader,
} = require("../lib/cms/reader.ts");
const manifest = require("../lib/image-manifest.json");
const catalog = require("../lib/project-catalog.json");
test("nowy katalog ma 12 unikalnych projektów i sześć właściwych wyróżnień", async () => {
  const projects = await getAllProjects();
  const featuredProjects = selectFeaturedProjects(projects);
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
  const projects = await getAllProjects();
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
test("nierozstrzygnięte archiwum nie trafia do głównego portfolio", async () => {
  const projects = await getAllProjects();
  const portfolioProjects = selectPortfolioProjects(projects);
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

test("szeroka okładka domu na Mazowszu zachowuje cały kadr", async () => {
  const projects = await getAllProjects();
  assert.equal(
    projects.find((p) => p.slug === "dom-mazowieckie").cover.objectFit,
    "contain",
  );
});

test("migracja CMS zachowuje cały publiczny kontrakt projektów i treści", async () => {
  const before = require("../docs/archive/cms-before-migration.json");
  const projects = await getAllProjects();
  assert.deepEqual(JSON.parse(JSON.stringify(projects)), before.projects);
  assert.deepEqual(require("../lib/site-content.ts"), {
    site: before.site,
    navigation: before.navigation,
    processSteps: before.processSteps,
  });
  assert.deepEqual(
    await reader.singletons.site.read(),
    require("../content/site.json"),
  );
  for (const project of projects)
    assert.deepEqual(await getProjectBySlug(project.slug), project);
  assert.equal(await getProjectBySlug("missing-project"), null);
  assert.equal(await getProjectBySlug("../site"), null);
});

test("nowy projekt i upload działają bez starego katalogu i manifestu", async () => {
  const slug = "cms-reader-test";
  const entryPath = path.resolve("content/projects", slug + ".json");
  const imagePath = path.resolve("public/images/projects", slug + ".png");
  const image = {
    src: `/images/projects/${slug}.png`,
    alt: "Test nowego uploadu",
    width: 1,
    height: 1,
  };
  try {
    await require("sharp")({
      create: { width: 17, height: 11, channels: 3, background: "white" },
    })
      .png()
      .toFile(imagePath);
    fs.writeFileSync(
      entryPath,
      JSON.stringify({
        title: "Nowy projekt CMS",
        category: "Domy",
        description: "Opis z CMS",
        order: 99,
        images: [image],
        cover: { ...image, objectFit: "contain", objectPosition: "50% 50%" },
        publicationStatus: "published",
        credits: { authorship: "pending-confirmation", note: "" },
      }),
      { flag: "wx" },
    );
    const project = await getProjectBySlug(slug);
    assert.equal(project.title, "Nowy projekt CMS");
    assert.equal(project.images[0].width, 17);
    assert.equal(project.images[0].height, 11);
    assert.equal(project.cover.objectFit, "contain");
    assert.ok((await getAllProjects()).some((p) => p.slug === slug));
    await require("sharp")({
      create: { width: 23, height: 13, channels: 3, background: "white" },
    })
      .png()
      .toFile(imagePath);
    const replaced = await getProjectBySlug(slug);
    assert.equal(replaced.images[0].width, 23);
    assert.equal(replaced.images[0].height, 13);
  } finally {
    fs.rmSync(entryPath, { force: true });
    fs.rmSync(imagePath, { force: true });
  }
});
