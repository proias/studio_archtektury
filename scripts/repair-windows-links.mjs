import fs from "node:fs/promises";
import path from "node:path";
if (process.platform !== "win32") process.exit(0);
const root = await fs.realpath(process.cwd());
let count = 0;
async function walk(directory) {
  for (const item of await fs.readdir(directory, { withFileTypes: true })) {
    const link = path.join(directory, item.name);
    if (item.isSymbolicLink()) {
      const target = await fs.readlink(link);
      if (
        target.toLowerCase().startsWith(root.toLowerCase() + path.sep) &&
        !target.startsWith(root + path.sep)
      ) {
        const correct = root + target.slice(root.length);
        if ((await fs.stat(target)).isDirectory()) {
          await fs.unlink(link);
          await fs.symlink(correct, link, "junction");
          count++;
        }
      }
    } else if (item.isDirectory()) await walk(link);
  }
}
await walk(path.join(root, "node_modules"));
console.log("Corrected workspace junction casing:", count);
