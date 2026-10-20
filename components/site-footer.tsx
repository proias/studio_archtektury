import Link from "next/link";
import { site } from "@/lib/site-content";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <Link href="/" className="wordmark">
          <span>PAULINA CYWIŃSKA</span>
          <small>STUDIO ARCHITEKTURY</small>
        </Link>
        <p>Domy. Wnętrza. Przestrzenie usługowe.</p>
        <Link href="/#kontakt" className="text-link">
          Porozmawiajmy ↗
        </Link>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Paulina Cywińska</span>
        <span>NIP {site.nip}</span>
        <Link href="/prywatnosc">Prywatność</Link>
      </div>
    </footer>
  );
}
