import catalog from "./project-catalog.json";
import manifest from "./image-manifest.json";
export const categories = [
  "Domy",
  "Obiekty usługowe",
  "Wnętrza",
  "Przestrzenie publiczne",
  "Przebudowy",
] as const;
export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
};
export type Project = {
  slug: string;
  title: string;
  category: (typeof categories)[number];
  location?: string;
  year?: number;
  description: string;
  cover: ProjectImage;
  images: ProjectImage[];
  credits: { authorship: "pending-confirmation"; note: string };
  publicationStatus: "draft" | "pending-confirmation" | "published";
  featuredOrder?: number;
};
export const projects: Project[] = catalog.map((entry) => {
  const images = entry.imageSources.map((src) => {
    const image = manifest.find((i) => i.src === src);
    if (!image) throw new Error("Brak obrazu w manifeście: " + src);
    return {
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
    };
  });
  return {
    slug: entry.slug,
    title: entry.title,
    category: entry.category as Project["category"],
    description: entry.description,
    images,
    cover: {
      ...images[0],
      objectPosition: entry.coverPosition,
      objectFit: entry.coverFit === "contain" ? "contain" : "cover",
    },
    credits: {
      authorship: "pending-confirmation",
      note: "Autorstwo, zakres współpracy i prawa do publikacji do potwierdzenia z Pauliną. Nowe portfolio nie rozstrzyga wcześniejszego konfliktu domu typu kostka.",
    },
    publicationStatus: entry.publicationStatus as Project["publicationStatus"],
    featuredOrder: "featuredOrder" in entry ? entry.featuredOrder : undefined,
  };
});
export const portfolioProjects = projects.filter(
  (p) => p.publicationStatus !== "pending-confirmation",
);
export const featuredProjects = portfolioProjects
  .filter((p) => p.featuredOrder)
  .sort((a, b) => a.featuredOrder! - b.featuredOrder!);
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
