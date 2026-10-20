import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="container section not-found">
      <p className="eyebrow">404</p>
      <h1>Nie znaleziono strony.</h1>
      <p>Ten adres nie prowadzi do dostępnego projektu.</p>
      <Link href="/projekty" className="text-link">
        Zobacz projekty →
      </Link>
    </main>
  );
}
