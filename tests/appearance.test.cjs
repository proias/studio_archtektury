const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
require("./register.cjs");
const {
  getHomeHero,
  getPrimaryCover,
  reader,
} = require("../lib/cms/reader.ts");

test("CMS: osobne zdjęcie główne, rzeczywiste wymiary i powrót do okładki projektu", async () => {
  const contentPath = path.resolve("content/appearance.json");
  const original = fs.readFileSync(contentPath);
  const uploadPath = path.resolve("public/images/site/cms-hero-test.png");
  assert.equal(fs.existsSync(uploadPath), false);
  try {
    const content = JSON.parse(original);
    const renderLogo = () => {
      for (const file of [
        "../components/site-wordmark.tsx",
        "../lib/appearance.ts",
        "../content/appearance.json",
      ])
        delete require.cache[require.resolve(file)];
      return require("react-dom/server").renderToStaticMarkup(
        require("react").createElement(
          require("../components/site-wordmark.tsx").SiteWordmark,
        ),
      );
    };
    content.logo.src = null;
    content.hero.src = null;
    fs.writeFileSync(contentPath, JSON.stringify(content));
    assert.ok(renderLogo().includes(content.logo.title));
    assert.deepEqual(await reader.singletons.appearance.read(), content);
    assert.deepEqual(await getHomeHero(), await getPrimaryCover());
    await require("sharp")({
      create: { width: 37, height: 19, channels: 3, background: "white" },
    })
      .png()
      .toFile(uploadPath);
    content.hero = {
      src: "/images/site/cms-hero-test.png",
      alt: "Nowe zdjęcie główne z CMS",
      objectFit: "cover",
      objectPosition: "50% 0%",
    };
    content.logo.src = content.hero.src;
    fs.writeFileSync(contentPath, JSON.stringify(content));
    const logoMarkup = renderLogo();
    assert.ok(logoMarkup.includes('class="wordmark-logo"'));
    assert.ok(logoMarkup.includes("cms-hero-test.png"));
    assert.deepEqual(await getHomeHero(), {
      ...content.hero,
      width: 37,
      height: 19,
    });
    content.hero.src = "/images/site/../../outside.png";
    fs.writeFileSync(contentPath, JSON.stringify(content));
    await assert.rejects(getHomeHero(), /Obraz poza katalogiem CMS/);
    content.hero.src = null;
    fs.writeFileSync(contentPath, JSON.stringify(content));
    assert.deepEqual(await getHomeHero(), await getPrimaryCover());
  } finally {
    fs.writeFileSync(contentPath, original);
    fs.rmSync(uploadPath, { force: true });
  }
});
