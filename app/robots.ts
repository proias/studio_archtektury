import type { MetadataRoute } from "next";
import { indexingEnabled } from "@/lib/indexing-policy.mjs";
import { canonicalUrl } from "@/lib/deployment";
export default function robots(): MetadataRoute.Robots {
  return indexingEnabled()
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: ["/keystatic", "/cms-preview", "/api/", "/__forms.html"],
        },
        sitemap: canonicalUrl("/sitemap.xml"),
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
