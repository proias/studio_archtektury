> Raport historyczny pierwszej wersji. Aktualny stan: [nowe portfolio i Netlify](RAPORT-NETLIFY-I-NOWE-PORTFOLIO.md).

# Raport wdrożenia wersji roboczej — 20.10.2026

Wdrożono przebudowę w istniejącym repozytorium C:/DS/studio_archtektury. Zachowano Next.js App Router, TypeScript, Tailwind CSS 4 i Radix/shadcn. Nie opublikowano na produkcji, nie utworzono zewnętrznego wdrożenia, nie kupowano usług.

## Lokalny podgląd

http://127.0.0.1:3000

Pozostawiono serwer gotowej kompilacji: npm run start -- --hostname 127.0.0.1. Spis siedmiu projektów: /projekty. Niepodlinkowane archiwum do oceny: /projekty/dom-kostka.

Po ponownym uruchomieniu komputera: corepack pnpm start --hostname 127.0.0.1. Do edycji: corepack pnpm dev --hostname 127.0.0.1. Nie uruchamiać build i dev jednocześnie w tym samym katalogu .next.

## Zakres

- Statyczny hero zgodny z mapą: DOM W ŁODZI/3.png, bez pionowego kadrowania na telefonie.
- Sześć kart w dokładnej kolejności i proporcjach 3:2. Poprawione kadry kuchni (wyspa i obie lampy) oraz łazienki (umywalka i lustro).
- Osiem kompletnych galerii; siedem w spisie projektów, ósma jako niepodlinkowane archiwum pending-confirmation. Nieznany projekt zwraca HTTP 404.
- Dostępne menu Radix, klawiatura, skip link, fokus, naturalne proporcje galerii i powiększenie ze strzałkami/Escape oraz przywracaniem fokusu.
- Sekcje O pracowni, pięć etapów współpracy, odnośnik do opinii Google, kontakt i wspólna stopka.
- Lokalne Montserrat i PT Sans z polskimi znakami i licencjami OFL; zmienne next/font połączone z Tailwind. Przeglądarka potwierdziła rodziny montserrat i ptSans.
- 21 WebP: 3,08 MB zamiast 36,44 MB PNG, około 91,6% mniej. Wymiary i oryginały bez zmian; mapowanie, alt i wagi w lib/image-manifest.json.
- Formularz ze wspólną walidacją Zod i polskimi komunikatami. Otwiera program pocztowy; nie udaje serwerowej wysyłki. Wydzielona walidacja serwera i kontrakt adaptera.
- Metadane projektów, Open Graph, język pl, jedno H1. Usunięte treści o Sopocie i działalności międzynarodowej.
- Blokada indeksacji: metadane, X-Robots-Tag i robots.txt. Canonical i publiczna mapa strony czekają na zatwierdzenie publikacji.

## Wyniki sprawdzeń

| Sprawdzenie | Wynik | Dowód |
|---|---|---|
| npm run typecheck / tsc --noEmit | zaliczone | qa/typecheck.log |
| npm run lint / next lint | bez ostrzeżeń i błędów | qa/lint-final.log |
| npm test | 6/6 | qa/unit-tests.log |
| npm run build | zaliczone, bez ostrzeżeń; pełny lint i kontrola typów | qa/build-verified.log |
| Chrome, testy gotowej kompilacji | 67/67 | qa/browser-results.json |
| Git diff --check | zaliczone | wykonano na końcu pracy |

Chrome: 390, 768, 1024 i 1440 px. Sprawdzono brak poziomego przewijania, hero 16:9, załadowane obrazy/fonty, sześć kart, ograniczenie animacji, menu Enter/Tab/Escape i fokus, kotwicę, filtry, bezpośrednie wejście i odświeżenie ośmiu galerii, proporcje, powiększenie i powrót fokusu, HTTP 404, błędy formularza, tel/mail/mapę, API 400 i 503 oraz blokadę indeksacji. Brak błędów JavaScript i niezaładowanych zasobów. Nie wysyłano prawdziwych zapytań.

Narzędzie przeglądarki aplikacji nie udostępniało żadnej przeglądarki. QA wykonano w lokalnym Chrome bez okna, na oddzielnym profilu tymczasowym, bez prywatnego profilu użytkownika.

## Zrzuty

- [Cała strona, komputer 1440 px](qa/home-1440.png)
- [Cała strona, telefon 390 px](qa/home-390.png)
- [Galeria kuchni](qa/gallery-desktop.png)
- [Poprawione kadry mobilne](qa/final-crops-mobile.png)
- [Wszystkie 21 obrazów](qa/image-contact-sheet.png)

Obejrzano zrzuty i komplet eksportów. W wyniku oglądu poprawiono kadry kuchni i łazienki. Usunięto też limit wysokości galerii, który zmieniał proporcje pionowych obrazów.

Zrzut początkowy nie powstał: pierwsza próba Chrome w sandboxie zakończyła się błędem procesu GPU. Zachowano pierwotny komponent i rekordy; nie przedstawiono rekonstrukcji jako oryginalnego zrzutu. Szczegóły: qa/baseline-notes.md. Referencja architekci.co nie dała się odczytać narzędziem WWW (timeout); zastosowano szczegółowe parametry wizualne briefu.

## Menedżer pakietów i błędy zastane

Wykryto pnpm 10.14.0 na podstawie node_modules/.modules.yaml i struktury instalacji. Przypięto packageManager. Zmieniono wyłącznie pnpm-lock.yaml; package-lock.json pozostaje bez zmian. Dodano ESLint, konfigurację Next zgodną z obecną wersją i Prettier. Nie aktualizowano zbiorczo zależności aplikacji.

Początkowy tsc przeszedł. Początkowy build miał problem z pobieraniem fontów i wielkością liter w dowiązaniach pnpm: C:/ds oraz C:/DS powodowały podwójne ładowanie React. Skorygowano wyłącznie lokalne dowiązania do tego checkoutu. Dawny cache zachowano w .next/cache/webpack-before-case-fix. Końcowy build nie ma tych ostrzeżeń.

Lint wykrył zastany problem actionTypes używanego tylko jako typ; zamieniono stałą na typ w obu kopiach hooka powiadomień, bez zmiany zachowania. Usunięto ignoreBuildErrors i ignoreDuringBuilds. Zachowano images.unoptimized ze względu na nierozstrzygnięty hosting i gotowe WebP.

## Zmienione i dodane pliki

- app/page.tsx, app/layout.tsx, app/globals.css — układ, typografia i metadane.
- app/projekty/page.tsx, app/projekty/[slug]/page.tsx, app/not-found.tsx — portfolio i galerie.
- app/api/contact/route.ts, app/prywatnosc/page.tsx, app/robots.ts — kontakt i podgląd.
- components/site-header.tsx, project-grid.tsx, project-gallery.tsx, contact-section.tsx, site-footer.tsx — wydzielone komponenty.
- lib/projects.ts, site-content.ts, image-manifest.json, contact-validation.ts, contact-adapter.ts, google-reviews-adapter.ts — dane i kontrakty integracji.
- public/images/projects/** — 21 WebP; pierwotne zasoby public zachowano.
- app/fonts/** — trzy fonty i dwie licencje OFL.
- components/ui/use-toast.ts i hooks/use-toast.ts — naprawa lint.
- next.config.mjs, package.json, pnpm-lock.yaml, .eslintrc.json — kontrole jakości.
- tests/projects.test.cjs, tests/contact.test.cjs, tests/register.cjs — testy danych i walidacji.
- scripts/browser-qa.mjs, export-images.mjs, fetch-fonts.mjs, repair-windows-links.mjs, check.mjs — zasoby i sprawdzenia.
- README.md, docs/legacy-projects.json, docs/qa/baseline-page.tsx.txt, raport, dokument integracji, kopia listy Pauliny i materiały QA.

## Otwarte elementy odbioru

1. **Wysyłka serwerowa:** brak wybranego dostawcy i aktywnego adaptera. Formularz jawnie otwiera program pocztowy; API zwraca 503 przy braku usługi. Faktyczne dostarczenie wiadomości musi być potwierdzone przed uznaniem integracji za gotową.
2. **CMS:** nie ma panelu administracyjnego. Przygotowano model danych; dostawca, logowanie, uprawnienia, magazyn obrazów i publikacja zależą od hostingu. Panel bez kodu pozostaje wymaganym etapem przed pełnym przekazaniem.
3. **Opinie Google:** działa odnośnik. Brak API i automatycznych kart; przygotowano kontrakt adaptera.
4. **Hosting i publikacja:** potwierdzić serwer Next/eksport statyczny, domenę, konfigurację zdjęć, prywatność i dane rejestrowe. Dopiero po akceptacji włączyć canonical, mapę strony i indeksację.
5. **Paulina:** pełna lista pozostaje otwarta w [DO-POTWIERDZENIA-Z-PAULINA.md](DO-POTWIERDZENIA-Z-PAULINA.md): autorstwo i zgody, powiązania z PDF i pracowniami, sporny dom kostka, nazwy/lata/lokalizacje/statusy, oferta i doświadczenie, portret i identyfikacja.

Szczegóły konfiguracji: [INTEGRACJE-I-PRZEKAZANIE.md](INTEGRACJE-I-PRZEKAZANIE.md). Otwarte punkty nie blokują działającej wersji roboczej.
