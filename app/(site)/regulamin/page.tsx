import type { Metadata } from "next";
import { site } from "@/lib/site-content";
import { canonicalUrl } from "@/lib/deployment";

export const metadata: Metadata = {
  title: "Regulamin strony",
  description:
    "Zasady korzystania ze strony internetowej i formularza kontaktowego Studio Architektury Pauliny Cywińskiej.",
  alternates: { canonical: canonicalUrl("/regulamin") },
};

export default function TermsPage() {
  return (
    <main id="main-content" className="container section privacy-page">
      <p className="eyebrow">Informacje prawne</p>
      <h1>Regulamin strony</h1>

      <h2>1. Usługodawca i zakres</h2>
      <p>
        Usługodawcą jest Paulina Cywińska prowadząca Studio Architektury, NIP{" "}
        {site.nip}, adres: {site.address}. Kontakt:{" "}
        <a href={"mailto:" + site.email}>{site.email}</a>,{" "}
        <a href={site.phoneHref}>{site.phone}</a>.
      </p>
      <p>
        Regulamin określa zasady korzystania ze strony, przeglądania portfolio i
        wysyłania zapytań przez formularz kontaktowy. Strona ma charakter
        informacyjny. Nie zawiera sklepu ani funkcji zawarcia umowy lub
        dokonania płatności online.
      </p>

      <h2>2. Wymagania techniczne</h2>
      <p>
        Do korzystania ze strony potrzebne są urządzenie z dostępem do
        Internetu, aktualna przeglądarka internetowa i aktywny adres e-mail —
        jeśli korzystasz z formularza. Korzystanie ze strony rozpoczyna się
        przez jej otwarcie i kończy po jej opuszczeniu. Wysłanie formularza
        służy wyłącznie przekazaniu zapytania; nie jest zawarciem umowy o
        wykonanie projektu.
      </p>

      <h2>3. Zapytania i umowy</h2>
      <p>
        Umowa na usługi projektowe jest ustalana indywidualnie i podpisywana
        osobiście podczas spotkania. Zakres, wynagrodzenie, terminy i pozostałe
        warunki określa odrębna umowa. Samo wysłanie zapytania ani treści tej
        strony nie zobowiązują do zawarcia takiej umowy.
      </p>

      <h2>4. Zasady korzystania i prawa</h2>
      <p>
        Użytkownik powinien korzystać ze strony zgodnie z prawem i nie przesyłać
        przez formularz treści bezprawnych, cudzych danych bez podstawy ani
        treści naruszających prawa innych osób. Projekty prezentowane w
        portfolio zostały opracowane przez architektkę; prawa i zakres
        korzystania z materiałów określają zawarte umowy. Materiały strony można
        przeglądać do użytku osobistego. Ich kopiowanie, rozpowszechnianie lub
        komercyjne wykorzystanie wymaga zgody uprawnionego podmiotu, chyba że
        przepisy stanowią inaczej.
      </p>

      <h2>5. Reklamacje</h2>
      <p>
        Reklamacje dotyczące działania strony lub formularza można zgłosić na{" "}
        <a href={"mailto:" + site.email}>{site.email}</a> albo pisemnie na adres
        usługodawcy. W zgłoszeniu opisz problem i podaj sposób kontaktu.
        Odpowiemy bez zbędnej zwłoki, nie później niż w ciągu 14 dni. Reklamacje
        dotyczące usług projektowych rozpatrujemy zgodnie z odrębną umową.
      </p>

      <h2>6. Dane osobowe i postanowienia końcowe</h2>
      <p>
        Zasady przetwarzania danych opisuje{" "}
        <a href="/prywatnosc">informacja o RODO i prywatności</a>. W sprawach
        nieuregulowanych regulaminem stosuje się prawo polskie. Regulamin
        obowiązuje od 28 października 2026 r.
      </p>
    </main>
  );
}
