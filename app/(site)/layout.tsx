import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site-content";
import { getPrimaryCover } from "@/lib/cms/reader";
import { PRODUCTION_ORIGIN } from "@/lib/deployment";
import { indexingEnabled } from "@/lib/indexing-policy.mjs";
import "../globals.css";
import "../atelier.css";
import "../showroom.css";
import "../ciepla.css";
const newsreader = localFont({
  src: "../fonts/Newsreader.woff2",
  weight: "300 500",
  display: "swap",
  variable: "--font-serif",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
const inter = localFont({
  src: "../fonts/Inter.woff2",
  weight: "400 600",
  display: "swap",
  variable: "--font-body",
  fallback: ["system-ui", "Arial", "sans-serif"],
});
export async function generateMetadata(): Promise<Metadata> {
  const cover = await getPrimaryCover();
  return {
    metadataBase: new URL(PRODUCTION_ORIGIN),
    title: { default: site.title, template: "%s — Paulina Cywińska" },
    description: site.description,
    robots: { index: indexingEnabled(), follow: indexingEnabled() },
    openGraph: {
      locale: "pl_PL",
      type: "website",
      siteName: site.name,
      title: site.title,
      description: site.description,
      images: cover
        ? [
            {
              url: cover.src,
              width: cover.width,
              height: cover.height,
              alt: cover.alt,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: cover ? [cover.src] : [],
    },
  };
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={newsreader.variable + " " + inter.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Przejdź do treści
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
