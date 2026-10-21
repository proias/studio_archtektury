import { createReader } from "@keystatic/core/reader";
import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import config from "../../keystatic.config";
import type { Project, ProjectImage } from "../projects";

export const reader = createReader(process.cwd(), config);
type Entry = NonNullable<
  Awaited<ReturnType<typeof reader.collections.projects.read>>
>;
type ImageEntry = { src: string | null; alt: string };
type Dimensions = { width: number; height: number };
// Store dimensions, never image buffers. A single queue bounds native work during builds.
const dimensions = new Map<
  string,
  { stamp: string; value: Promise<Dimensions> }
>();
let imageQueue: Promise<unknown> = Promise.resolve();

async function imageDimensions(filename: string): Promise<Dimensions> {
  const cached = dimensions.get(filename);
  if (process.env.NODE_ENV === "production" && cached) return cached.value;
  // Development must see an image replaced at the same path without restarting Next.
  const info = await stat(filename);
  const stamp = `${info.mtimeMs}:${info.size}`;
  const current = dimensions.get(filename);
  if (current?.stamp === stamp) return current.value;
  const value = imageQueue.then(async () => {
    const { width, height } = await sharp(filename).metadata();
    if (!width || !height)
      throw new Error(`Nie można odczytać wymiarów: ${filename}`);
    return { width, height };
  });
  imageQueue = value.catch(() => undefined);
  const entry = { stamp, value };
  dimensions.set(filename, entry);
  void value.catch(() => {
    if (dimensions.get(filename) === entry) dimensions.delete(filename);
  });
  return value;
}

async function mapImage(
  image: ImageEntry,
  directory: "projects" | "site" = "projects",
): Promise<ProjectImage> {
  const src = image.src;
  if (!src?.startsWith(`/images/${directory}/`))
    throw new Error(`Nieprawidłowa ścieżka obrazu CMS: ${src}`);
  const root = path.resolve(process.cwd(), "public/images", directory);
  const filename = path.resolve(process.cwd(), "public", src.slice(1));
  if (!filename.startsWith(root + path.sep))
    throw new Error("Obraz poza katalogiem CMS");
  const { width, height } = await imageDimensions(filename);
  return { src, alt: image.alt, width, height };
}
async function mapProject(slug: string, entry: Entry): Promise<Project> {
  const [cover, images] = await Promise.all([
    mapImage(entry.cover),
    Promise.all(entry.images.map((image) => mapImage(image))),
  ]);
  return {
    slug,
    title: entry.title,
    category: entry.category,
    ...(entry.location ? { location: entry.location } : {}),
    ...(entry.year !== null ? { year: entry.year } : {}),
    description: entry.description,
    contentStatus: entry.contentStatus,
    seo: {
      title: entry.seo.title,
      description: entry.seo.description,
      image: entry.seo.image
        ? await mapImage(
            { src: entry.seo.image, alt: entry.seo.imageAlt || entry.title },
            "site",
          )
        : null,
    },
    cover: {
      ...cover,
      objectPosition: entry.cover.objectPosition,
      objectFit: entry.cover.objectFit,
    },
    images,
    credits: { ...entry.credits },
    publicationStatus: entry.publicationStatus,
    featuredOrder: entry.featuredOrder ?? undefined,
  };
}
async function orderedEntries() {
  const entries = await reader.collections.projects.all();
  entries.sort(
    (a, b) =>
      (a.entry.order ?? 100) - (b.entry.order ?? 100) ||
      a.slug.localeCompare(b.slug),
  );
  return entries;
}
export async function getAllProjects(): Promise<Project[]> {
  return Promise.all(
    (await orderedEntries())
      .filter(({ entry }) => entry.publicationStatus === "published")
      .map(({ slug, entry }) => mapProject(slug, entry)),
  );
}
export async function getAllCmsProjects(): Promise<Project[]> {
  return Promise.all(
    (await orderedEntries()).map(({ slug, entry }) => mapProject(slug, entry)),
  );
}
export async function getProjectSlugs(): Promise<string[]> {
  return (await orderedEntries())
    .filter(({ entry }) => entry.publicationStatus === "published")
    .map(({ slug }) => slug);
}
export async function getPortfolioNavigation() {
  return (await orderedEntries())
    .filter(({ entry }) => entry.publicationStatus === "published")
    .map(({ slug, entry }) => ({ slug, title: entry.title }));
}
export async function getFeaturedProjects(): Promise<Project[]> {
  const entries = (await orderedEntries())
    .filter(
      ({ entry }) =>
        entry.publicationStatus === "published" && entry.featuredOrder,
    )
    .sort((a, b) => a.entry.featuredOrder! - b.entry.featuredOrder!);
  return Promise.all(entries.map(({ slug, entry }) => mapProject(slug, entry)));
}
export async function getPrimaryCover(): Promise<ProjectImage | null> {
  const entries = (await orderedEntries()).filter(
    ({ entry }) => entry.publicationStatus === "published",
  );
  const featured = entries
    .filter(
      ({ entry }) =>
        entry.publicationStatus === "published" && entry.featuredOrder,
    )
    .sort((a, b) => a.entry.featuredOrder! - b.entry.featuredOrder!);
  const entry = (featured[0] || entries[0])?.entry;
  return entry ? mapImage(entry.cover) : null;
}
export async function getHomeHero(): Promise<
  | (ProjectImage & {
      objectFit?: "contain" | "cover";
      objectPosition?: string;
    })
  | null
> {
  const content = await reader.singletons.appearance.read();
  if (!content?.hero.src) return getPrimaryCover();
  if (!content.hero.alt.trim())
    throw new Error("Uzupełnij opis zdjęcia głównego w CMS.");
  return {
    ...(await mapImage(content.hero, "site")),
    objectFit: content.hero.objectFit,
    objectPosition: content.hero.objectPosition,
  };
}
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const entry = await reader.collections.projects.read(slug);
  return entry?.publicationStatus === "published"
    ? mapProject(slug, entry)
    : null;
}
export const selectPortfolioProjects = (projects: Project[]) =>
  projects.filter((project) => project.publicationStatus === "published");
export const selectFeaturedProjects = (projects: Project[]) =>
  selectPortfolioProjects(projects)
    .filter((project) => project.featuredOrder)
    .sort((a, b) => a.featuredOrder! - b.featuredOrder!);
