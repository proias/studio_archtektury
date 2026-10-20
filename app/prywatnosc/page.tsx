import type { Metadata } from "next";
import { site } from "@/lib/site-content";
export const metadata: Metadata = { title: "Prywatność" };
export default function PrivacyPage() {
  return (
    <main id="main-content" className="container section privacy-page">
      <p className="eyebrow">Kontakt i dane</p>
      <h1>Prywatność</h1>
      <p>
        W tym podglądzie formularz przygotowuje treść wiadomości w przeglądarce,
        a następnie otwiera Twój program pocztowy. Dane nie są wysyłane przez
        stronę ani zapisywane w publicznych plikach. O wysłaniu wiadomości
        decydujesz w swoim programie pocztowym.
      </p>
      <p>
        W sprawie danych przekazanych w korespondencji możesz skontaktować się z
        pracownią: <a href={"mailto:" + site.email}>{site.email}</a>.
      </p>
      <p>
        Strona nie osadza map, opinii ani analityki. Linki do Google otwierają
        zewnętrzny serwis, który stosuje własne zasady prywatności.
      </p>
    </main>
  );
}
