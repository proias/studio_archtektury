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
        <nav className="footer-legal-links" aria-label="Informacje prawne">
          <Link href="/prywatnosc">{pageCopy.footer.privacyLink}</Link>
          <Link href="/regulamin">Regulamin</Link>
        </nav>
      </div>
    </footer>
  );
}
