/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    globalNotFound: true,
    cpus: 2,
    webpackMemoryOptimizations: true,
  },
  // Public pages are generated at build time, including every project slug.
  // Images stay in public/CDN instead of being copied into every API function.
  // OpenNext na Netlify kieruje next/image do Image CDN; lokalnie działa optymalizator Next.
  images: { unoptimized: false },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
export default nextConfig;
