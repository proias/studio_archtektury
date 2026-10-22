import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/** @param {{source: string, destination: string}[]} entries @param {string[]} publicPaths */
export function validateRedirects(entries, publicPaths) {
  const paths = new Set(publicPaths);
  const sources = new Set();
  for (const { source, destination } of entries) {
    for (const value of [source, destination]) {
      if (
        !/^\/(?!\/)[A-Za-z0-9/_.-]*$/.test(value) ||
        value.includes("//") ||
        value
          .split("/")
          .some((segment) => segment === "." || segment === "..") ||
        (value.length > 1 && value.endsWith("/"))
      )
        throw new Error(`Nieprawidłowa ścieżka przekierowania: ${value}`);
    }
    if (
      /^\/(api|keystatic|_next)(\/|$)/.test(source) ||
      source === "/__forms.html"
    )
      throw new Error("Przekierowanie nie może zastępować tras technicznych.");
    if (sources.has(source))
      throw new Error(`Powtórzony stary adres: ${source}`);
    if (paths.has(source))
      throw new Error(`Stary adres koliduje z aktywną stroną: ${source}`);
    if (!paths.has(destination))
      throw new Error(`Cel nie jest opublikowaną stroną: ${destination}`);
    if (source === destination)
      throw new Error("Przekierowanie do tego samego adresu");
    sources.add(source);
  }
  for (const entry of entries) {
    if (sources.has(entry.destination))
      throw new Error("Łańcuch lub pętla przekierowań");
  }
  return entries.map(({ source, destination }) => ({
    source,
    destination,
    permanent: true,
  }));
}

export function loadRedirects(root = process.cwd()) {
  const projectsDir = path.join(root, "content/projects");
  const projectPaths = readdirSync(projectsDir)
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => {
      const project = JSON.parse(
        readFileSync(path.join(projectsDir, file), "utf8"),
      );
      return project.publicationStatus === "published"
        ? [`/projekty/${file.slice(0, -5)}`]
        : [];
    });
  const registry = JSON.parse(
    readFileSync(path.join(root, "content/redirects.json"), "utf8"),
  );
  return validateRedirects(registry.entries, [
    "/",
    "/projekty",
    "/prywatnosc",
    ...projectPaths,
  ]);
}
