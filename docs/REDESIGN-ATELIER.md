# Redesign — Atelier editorial, 26.10.2026

Kompletna nowa oprawa istniejącej aplikacji Next.js / Keystatic według PRD i referencji użytkownika.

## Zmiany
- Space Grotesk hostowany lokalnie z licencją OFL, ciepła biel #FAF9F6, grafit #121312 i akcent #244B7A.
- Typograficzne otwarcie, wizualizacja głównego projektu, manifest, wyróżniony projekt oraz pozostałe opublikowane portfolio.
- Sekcja pracowni z rzeczywistym materiałem warsztatowym, proces 01–05 jako natywne details, karta briefu na jasnym tle.
- Animacja odkrywania zdjęć przez IntersectionObserver i Web Animations, hover zdjęć, pasek postępu i powrót na górę. Treść pozostaje widoczna bez JS; prefers-reduced-motion wyłącza ruch.
- Spójna oprawa katalogu, filtrów i stron projektów; galerie, walidacja i transport Netlify Forms zachowane.
- JSON-LD ProfessionalService z istniejącymi danymi oraz dotychczasowe canonical/robots/SEO.

## Portfolio i CMS
Dwa obecnie opublikowane wpisy pozostają dostępne; dziesięć szkiców zachowuje status. Nie zmieniano rekordów projektów ani materiałów portfolio. Główna fotografia to okładka pierwszego wyróżnionego, opublikowanego projektu (lub pierwszego opublikowanego, jeśli brak wyróżnień). Dotychczasowe pole appearance.hero steruje ilustracją w sekcji O pracowni; etykiety w CMS zostały dopasowane. Istniejące klucze danych i proces zapisywania pozostają. Brak portretu w materiałach zastąpiono rzeczywistym rysunkiem pracowni. Zmiana public/lp1.png była obecna przed rozpoczęciem pracy i nie została ruszona.

## Kontrola
Build produkcyjny, typy, ESLint i 22 istniejące testy zakończyły się poprawnie. Detektor Impeccable: brak zgłoszeń. Niezależny przegląd screenshotów telefonu i desktopu: ship, bez istotnych usterek wizualnych. Końcowe szczegóły testów przeglądarkowych znajdują się w docs/qa-redesign/browser-results.json po zakończeniu przebiegu.

## Superdesign
Canvas utworzony: https://superdesign.dev/teams/7d979336-f2cb-4137-a305-f94bafa71155/projects/02623cc1-4b88-4e67-8de5-179251eb5389
Przesłano jedną istniejącą wizualizację. Draft z kodu nie został utworzony: automatyczna kontrola zgód odrzuciła wysłanie prywatnych źródeł do zewnętrznego Superdesign. Eksport wymaga zgody użytkownika. Lokalny redesign działa niezależnie od tego eksportu. Nie wykonano publikacji produkcyjnej.

Końcowy przebieg QA: 69/69 kontroli przeglądarkowych przeszło. Szerokości 390, 768, 1024 i 1440 px: brak overflow, obrazy załadowane, lokalne fonty i reduced-motion poprawne. Przetestowano menu klawiaturą, filtry, obie opublikowane galerie, statusy pozostałych tras, lightbox, błędy walidacji i obsługę wysyłki na atrapach odpowiedzi (bez rzeczywistych zapytań do pracowni). Brak błędów JS i nieudanych zasobów. Powtórnie 22/22 testy logiki przeszły po końcowych zmianach CMS.
