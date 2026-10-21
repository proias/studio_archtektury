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
