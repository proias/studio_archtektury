/** @type {import('next').NextConfig} */
const nextConfig = {
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
