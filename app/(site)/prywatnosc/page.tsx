import type { Metadata } from "next";
import { site } from "@/lib/site-content";
import { canonicalUrl } from "@/lib/deployment";
export const metadata: Metadata = {
  title: "Prywatność",
  alternates: { canonical: canonicalUrl("/prywatnosc") },
};
export default function PrivacyPage() {
  return (
    <main id="main-content" className="container section privacy-page">
      <p className="eyebrow">Kontakt i dane</p>
      <h1>Prywatność</h1>
      <p>
        Formularz kontaktowy przesyła imię i nazwisko, adres e-mail, opcjonalny
        numer telefonu, rodzaj projektu i treść zapytania do pracowni{" "}
        {site.name}. Dane służą obsłudze zapytania i dalszej korespondencji.
      </p>
      <p>
        Strona korzysta z Netlify jako dostawcy hostingu oraz usługi Netlify
        Forms do obsługi i filtrowania zgłoszeń. Zgłoszenia są zapisywane w
        panelu usługi; powiadomienia mogą trafiać do skrzynki pracowni. Usługa
        może przetwarzać również techniczne dane żądania na potrzeby
        bezpieczeństwa i ochrony przed spamem.
      </p>
      <p>
        W sprawie przekazanych danych, ich przechowywania, poprawienia lub
        usunięcia skontaktuj się z pracownią:{" "}
        <a href={"mailto:" + site.email}>{site.email}</a>. Adres pracowni:{" "}
        {site.address}, NIP {site.nip}.
      </p>
      <p>
        Nie podawaj w formularzu danych wrażliwych ani dokumentów, które nie są
        potrzebne do wstępnego zapytania. Bezpośredni kontakt e-mail i
        telefoniczny jest dostępny jako alternatywa dla formularza.
      </p>
      <p>
        Strona nie osadza map, opinii ani analityki. Linki do Google otwierają
        zewnętrzny serwis, który stosuje własne zasady prywatności. Informacje o
        usługach Netlify znajdziesz w{" "}
        <a
          href="https://www.netlify.com/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          polityce prywatności Netlify
        </a>
        .
      </p>
    </main>
  );
}
