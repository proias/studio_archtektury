// One-time, non-overwriting migration. The legacy files remain as an audit snapshot.
const fs = require("node:fs");
const path = require("node:path");
const {
  projects,
  site,
  navigation,
  processSteps,
} = require("../docs/archive/cms-before-migration.json");
const catalog = require("../lib/project-catalog.json");

function write(relative, value) {
  const destination = path.resolve(__dirname, "..", relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, JSON.stringify(value, null, 2) + "\n", {
    flag: "wx",
  });
}
projects.forEach((project, order) => {
  const { slug, ...entry } = project;
  write(`content/projects/${slug}.json`, {
    ...entry,
    order: order + 1,
    sourceFolder: catalog[order].sourceFolder,
  });
});
write("content/site.json", { ...site, navigation, processSteps });
console.log(
  `Migrated ${projects.length} projects and site settings without changing assets.`,
);
