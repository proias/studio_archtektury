import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site-content";
import { getPrimaryCover } from "@/lib/cms/reader";
import { getPreviewOrigin } from "@/lib/deployment";
import "../globals.css";
const montserrat = localFont({
  src: "../fonts/Montserrat.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-montserrat",
});
const ptSans = localFont({
  src: [
    { path: "../fonts/PTSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/PTSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-pt-sans",
});
export async function generateMetadata(): Promise<Metadata> {
  const cover = await getPrimaryCover();
  return {
    metadataBase: new URL(getPreviewOrigin()),
    title: { default: site.title, template: "%s — Paulina Cywińska" },
    description: site.description,
    robots: { index: false, follow: false },
    openGraph: {
      locale: "pl_PL",
      type: "website",
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
    twitter: { card: "summary_large_image" },
  };
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={montserrat.variable + " " + ptSans.variable}>
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
