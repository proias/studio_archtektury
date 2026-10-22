const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
require("./register.cjs");
const cms = require("../lib/cms/reader.ts");
const { categories } = require("../lib/projects.ts");

test("migracja historyczna odtwarza archiwum bez zależności od późniejszych edycji CMS", () => {
  const before = require("../docs/archive/cms-before-migration.json");
  const writes = new Map();
  vm.runInNewContext(fs.readFileSync("scripts/migrate-cms.cjs", "utf8"), {
    __dirname: path.resolve("scripts"),
    console: { log() {} },
    require(name) {
      if (name === "node:fs")
        return {
          mkdirSync() {},
          writeFileSync(filename, data, options) {
            assert.equal(options.flag, "wx");
            writes.set(filename, JSON.parse(data));
          },
        };
      if (name === "node:path") return path;
      if (name.includes("cms-before-migration")) return before;
      if (name.includes("project-catalog"))
        return require("../lib/project-catalog.json");
      throw new Error(name);
    },
  });
  assert.equal(writes.size, before.projects.length + 1);
  for (const project of before.projects) {
    const { order, sourceFolder, ...entry } = writes.get(
      path.resolve("content/projects", project.slug + ".json"),
    );
    const { slug, ...original } = project;
    assert.deepEqual(entry, original);
    assert.ok(order > 0 && sourceFolder);
  }
  assert.deepEqual(writes.get(path.resolve("content/site.json")), {
    ...before.site,
    navigation: before.navigation,
    processSteps: before.processSteps,
  });
});

test("CMS zachowuje wpisy i obrazy, a publiczny odczyt odpowiada statusom publikacji", async () => {
  const source = fs
    .readdirSync("content/projects")
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({
      ...JSON.parse(
        fs.readFileSync(path.join("content/projects", file), "utf8"),
      ),
      slug: file.slice(0, -5),
    }))
    .sort(
      (a, b) =>
        (a.order ?? 100) - (b.order ?? 100) || a.slug.localeCompare(b.slug),
    );
  const all = await cms.getAllCmsProjects();
  assert.equal(all.length, source.length);
  assert.equal(new Set(all.map((p) => p.slug)).size, source.length);
  for (const project of all) {
    assert.ok(categories.includes(project.category));
    assert.ok(["temporary", "approved"].includes(project.contentStatus));
    for (const image of [project.cover, ...project.images]) {
      assert.ok(image.width > 0 && image.height > 0 && image.alt.trim());
      assert.ok(fs.existsSync(path.join("public", image.src)));
    }
  }
  const expected = source.filter((p) => p.publicationStatus === "published");
  const published = await cms.getAllProjects();
  assert.deepEqual(
    published.map((p) => p.slug),
    expected.map((p) => p.slug),
  );
  assert.deepEqual(
    await cms.getProjectSlugs(),
    expected.map((p) => p.slug),
  );
  assert.deepEqual(
    await cms.getPortfolioNavigation(),
    expected.map((p) => ({ slug: p.slug, title: p.title })),
  );
  assert.deepEqual(
    (await cms.getFeaturedProjects()).map((p) => p.slug),
    expected
      .filter((p) => p.featuredOrder)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .map((p) => p.slug),
  );
  for (const project of source.filter(
    (p) => p.publicationStatus !== "published",
  ))
    assert.equal(await cms.getProjectBySlug(project.slug), null);
  assert.equal(await cms.getProjectBySlug("../site"), null);
  assert.equal(await cms.getProjectBySlug("missing-project"), null);
});

test("zmiana statusu steruje całym odczytem publicznym, a upload i zastąpienie pliku odświeżają wymiary", async () => {
  const slug = "cms-reader-test";
  const entryPath = path.resolve("content/projects", slug + ".json");
  const imagePath = path.resolve("public/images/projects", slug + ".png");
  assert.equal(fs.existsSync(entryPath), false);
  assert.equal(fs.existsSync(imagePath), false);
  const image = {
    src: "/images/projects/" + slug + ".png",
    alt: "Test uploadu CMS",
  };
  const entry = {
    title: "Test CMS",
    category: "Domy",
    description: "Opis",
    order: 99,
    images: [image],
    cover: { ...image, objectFit: "contain", objectPosition: "50% 50%" },
    publicationStatus: "draft",
    featuredOrder: 99,
    credits: { authorship: "pending-confirmation", note: "" },
  };
  const save = () => fs.writeFileSync(entryPath, JSON.stringify(entry));
  try {
    await require("sharp")({
      create: { width: 17, height: 11, channels: 3, background: "white" },
    })
      .png()
      .toFile(imagePath);
    save();
    assert.equal(await cms.getProjectBySlug(slug), null);
    assert.ok(!(await cms.getProjectSlugs()).includes(slug));
    entry.publicationStatus = "published";
    save();
    assert.equal((await cms.getProjectBySlug(slug)).cover.width, 17);
    assert.ok((await cms.getProjectSlugs()).includes(slug));
    assert.ok((await cms.getFeaturedProjects()).some((p) => p.slug === slug));
    for (const authorship of ["own", "coauthored", "licensed"]) {
      entry.credits = {
        authorship,
        note: "Potwierdzone w dokumentacji projektu",
      };
      save();
      assert.deepEqual(
        (await cms.getProjectBySlug(slug)).credits,
        entry.credits,
      );
    }
    await require("sharp")({
      create: { width: 23, height: 13, channels: 3, background: "white" },
    })
      .png()
      .toFile(imagePath);
    assert.equal((await cms.getProjectBySlug(slug)).cover.width, 23);
    entry.publicationStatus = "pending-confirmation";
    save();
    assert.equal(await cms.getProjectBySlug(slug), null);
    assert.ok(
      !(await cms.getPortfolioNavigation()).some((p) => p.slug === slug),
    );
    assert.ok(!(await cms.getFeaturedProjects()).some((p) => p.slug === slug));
  } finally {
    fs.rmSync(entryPath, { force: true });
    fs.rmSync(imagePath, { force: true });
  }
});
