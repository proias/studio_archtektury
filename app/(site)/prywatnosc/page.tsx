import type { Metadata } from "next";
import { site } from "@/lib/site-content";
import { canonicalUrl } from "@/lib/deployment";

export const metadata: Metadata = {
  title: "RODO i prywatność",
  description:
    "Informacje o przetwarzaniu danych osobowych i prywatności w Studio Architektury Pauliny Cywińskiej.",
  alternates: { canonical: canonicalUrl("/prywatnosc") },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="container section privacy-page">
      <p className="eyebrow">Informacje prawne</p>
      <h1>RODO i prywatność</h1>

      <h2>Administrator</h2>
      <p>
        Administratorem danych jest Paulina Cywińska prowadząca Studio
        Architektury, NIP {site.nip}, adres: {site.address}. Kontakt w sprawach
        danych: <a href={"mailto:" + site.email}>{site.email}</a>, tel.{" "}
        <a href={site.phoneHref}>{site.phone}</a>.
      </p>

      <h2>Jakie dane i w jakim celu</h2>
      <p>
        Gdy wysyłasz formularz, przetwarzamy podane przez Ciebie imię i
        nazwisko, adres e-mail, rodzaj projektu, treść wiadomości oraz
        opcjonalnie numer telefonu. Dane wykorzystujemy, aby odpowiedzieć na
        zapytanie i — na Twoją prośbę — podjąć działania przed zawarciem umowy.
        Podstawą jest art. 6 ust. 1 lit. b RODO. Dane techniczne żądania mogą
        być przetwarzane w celu zapewnienia bezpieczeństwa strony na podstawie
        prawnie uzasadnionego interesu administratora (art. 6 ust. 1 lit. f
        RODO).
      </p>
      <p>
        Podanie danych oznaczonych w formularzu jako wymagane jest dobrowolne,
        ale potrzebne do obsługi zapytania. Nie podawaj danych wrażliwych ani
        informacji, które nie są potrzebne do pierwszego kontaktu. Nie
        podejmujemy wobec Ciebie decyzji wyłącznie automatycznie.
      </p>

      <h2>Odbiorcy i czas przechowywania</h2>
      <p>
        Formularz obsługuje Netlify Forms. Dane mogą być dostępne dla dostawców
        hostingu, poczty i wsparcia IT — wyłącznie w zakresie potrzebnym do
        obsługi strony i zapytania. Dostawca może przetwarzać dane poza
        Europejskim Obszarem Gospodarczym; informacje o stosowanych
        zabezpieczeniach i transferach opisuje{" "}
        <a
          href="https://www.netlify.com/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          polityka prywatności Netlify
        </a>
        .
      </p>
      <p>
        Dane z korespondencji przechowujemy przez czas potrzebny do obsługi
        zapytania, a następnie przez okres niezbędny do ustalenia, dochodzenia
        lub obrony ewentualnych roszczeń. Dane techniczne przechowujemy przez
        okres wynikający z potrzeb bezpieczeństwa i konfiguracji dostawcy
        hostingu.
      </p>

      <h2>Twoje prawa</h2>
      <p>
        Masz prawo żądać dostępu do danych, ich sprostowania, usunięcia lub
        ograniczenia przetwarzania, a w przypadkach przewidzianych prawem —
        przeniesienia danych lub wnieść sprzeciw. W sprawie realizacji praw
        napisz na <a href={"mailto:" + site.email}>{site.email}</a>. Możesz
        również złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
      </p>

      <h2>Cookies i usługi zewnętrzne</h2>
      <p>
        Publiczna część strony nie korzysta z własnych cookies analitycznych ani
        reklamowych. Dostawca hostingu może przetwarzać techniczne dane
        potrzebne do dostarczania i zabezpieczenia strony. Link do mapy Google
        prowadzi do zewnętrznego serwisu — jego zasady prywatności mają
        zastosowanie po przejściu na tę stronę. Panel redakcyjny może używać
        technicznych cookies niezbędnych do logowania.
      </p>
    </main>
  );
}
