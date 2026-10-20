import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const sourceRoot = process.argv[2];
if (!sourceRoot)
  throw new Error("Podaj folder źródłowy portfolio jako pierwszy argument.");
const manifest = JSON.parse(
  await fs.readFile("lib/image-manifest.json", "utf8"),
);
for (const image of manifest) {
  const source = path.join(sourceRoot, image.source);
  const output = path.join("public", image.src);
  const meta = await sharp(source).metadata();
  if (meta.width !== image.width || meta.height !== image.height)
    throw new Error("Zmienione wymiary źródła: " + image.source);
  await fs.mkdir(path.dirname(output), { recursive: true });
  const bytes = await sharp(source).webp({ quality: 84, effort: 6 }).toBuffer();
  await fs.writeFile(output, bytes);
  image.sourceBytes = (await fs.stat(source)).size;
  image.bytes = bytes.length;
  image.sha256 = createHash("sha256")
    .update(await fs.readFile(source))
    .digest("hex");
}
await fs.writeFile(
  "lib/image-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log("Wyeksportowano", manifest.length, "plików bez zmiany źródeł.");
