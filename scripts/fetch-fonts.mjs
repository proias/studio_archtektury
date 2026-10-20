import { mkdir, writeFile } from "node:fs/promises";
await mkdir("app/fonts", { recursive: true });
const files = [
  ["ofl/montserrat/Montserrat[wght].ttf", "Montserrat.ttf"],
  ["ofl/ptsans/PT_Sans-Web-Regular.ttf", "PTSans-Regular.ttf"],
  ["ofl/ptsans/PT_Sans-Web-Bold.ttf", "PTSans-Bold.ttf"],
  ["ofl/montserrat/OFL.txt", "Montserrat-OFL.txt"],
  ["ofl/ptsans/OFL.txt", "PTSans-OFL.txt"],
];
for (const [src, dest] of files) {
  const response = await fetch(
    "https://raw.githubusercontent.com/google/fonts/main/" + src,
  );
  if (!response.ok) throw new Error(src + ": " + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile("app/fonts/" + dest, bytes);
  console.log(dest, bytes.length);
}
