import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/cms/reader";
import { canonicalUrl } from "@/lib/deployment";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.CONTEXT && process.env.CONTEXT !== "production") return [];
  return [
    "/",
    "/projekty",
    "/prywatnosc",
    "/regulamin",
    ...(await getProjectSlugs()).map((slug) => `/projekty/${slug}`),
  ].map((pathname) => ({ url: canonicalUrl(pathname) }));
}
