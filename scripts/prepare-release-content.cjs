const fs = require("node:fs");
const path = require("node:path");
// One-off release content preparation. Never run automatically during builds.
for (const file of fs
  .readdirSync("content/projects")
  .filter((file) => file.endsWith(".json"))) {
  const filename = path.join("content/projects", file);
  const entry = JSON.parse(fs.readFileSync(filename, "utf8"));
  if (!entry.description?.trim()) {
    entry.description =
      entry.images.map((image) => image.alt.replace(/[.!?]$/, "")).join(". ") +
      ".";
  }
  entry.contentStatus ??= "temporary";
  entry.editorialNotes ??=
    "Opis tymczasowy oparty wyłącznie na opisach istniejących wizualizacji. Do uzupełnienia: potwierdzone założenia, zakres pracy i informacje o realizacji. Nie dopisywać niepotwierdzonych danych.";
  entry.seo ??= { title: "", description: "", image: null, imageAlt: "" };
  if (file === "dom-lodzkie-3.json") {
    entry.publicationStatus = "published";
    entry.editorialNotes += entry.editorialNotes.includes("21.10.2026")
      ? ""
      : " Zatwierdzony do publikacji przez właściciela w rozmowie 21.10.2026; dane redakcyjne pozostają tymczasowe.";
  }
  fs.writeFileSync(filename, JSON.stringify(entry, null, 2) + "\n");
}
console.log(
  "Prepared 12 descriptions; dom-lodzkie-3 published. Existing uploads and facts preserved.",
);
