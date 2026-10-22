import { indexingEnabled } from "./lib/indexing-policy.mjs";
import { loadRedirects } from "./lib/redirects.mjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  experimental: {
    globalNotFound: true,
    cpus: 2,
    webpackMemoryOptimizations: true,
  },
  // Public pages are generated at build time, including every project slug.
  // Images stay in public/CDN instead of being copied into every API function.
  // OpenNext na Netlify kieruje next/image do Image CDN; lokalnie działa optymalizator Next.
  images: { unoptimized: false },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.cywinska-studio.pl" }],
        destination: "https://cywinska-studio.pl/:path*",
        permanent: true,
      },
      ...loadRedirects(),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(!indexingEnabled()
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/keystatic/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/cms-preview",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/__forms.html",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};
export default nextConfig;
