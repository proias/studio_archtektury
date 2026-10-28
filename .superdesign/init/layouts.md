## app/(site)/layout.tsx
```
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site-content";
import { getHomeHero } from "@/lib/cms/reader";
import { PRODUCTION_ORIGIN } from "@/lib/deployment";
import { indexingEnabled } from "@/lib/indexing-policy.mjs";
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
  const cover = await getHomeHero();
  return {
    metadataBase: new URL(PRODUCTION_ORIGIN),
    title: { default: site.title, template: "%s — Paulina Cywińska" },
    description: site.description,
    robots: { index: indexingEnabled(), follow: indexingEnabled() },
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

```
## components/site-header.tsx
```
"use client";
import Link from "next/link";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/site-content";
import { SiteWordmark } from "./site-wordmark";
import { pageCopy } from "@/lib/page-content";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label={pageCopy.navigation.homeLabel}
        >
          <SiteWordmark />
        </Link>
        <nav className="desktop-nav" aria-label="Nawigacja główna">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className="menu-toggle"
              aria-label="Otwórz menu"
              aria-expanded={open}
            >
              <Menu size={23} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="menu-overlay" />
            <Dialog.Content className="mobile-menu">
              <Dialog.Title className="eyebrow">Nawigacja</Dialog.Title>
              <Dialog.Description className="sr-only">
                Wybierz sekcję strony pracowni.
              </Dialog.Description>
              <Dialog.Close asChild>
                <button className="menu-close" aria-label="Zamknij menu">
                  <X />
                </button>
              </Dialog.Close>
              <nav aria-label="Nawigacja mobilna">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <p>
                {pageCopy.navigation.mobileName}
                <br />
                {pageCopy.navigation.mobileSubtitle}
              </p>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}

```
## components/site-footer.tsx
```
import Link from "next/link";
import { site } from "@/lib/site-content";
import { SiteWordmark } from "./site-wordmark";
import { pageCopy } from "@/lib/page-content";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <Link href="/" className="wordmark">
          <SiteWordmark />
        </Link>
        <p>{pageCopy.footer.tagline}</p>
        <Link href="/#kontakt" className="text-link">
          {pageCopy.footer.contactLink} ↗
        </Link>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {pageCopy.footer.copyrightName}
        </span>
        <span>NIP {site.nip}</span>
        <Link href="/prywatnosc">{pageCopy.footer.privacyLink}</Link>
      </div>
    </footer>
  );
}

```