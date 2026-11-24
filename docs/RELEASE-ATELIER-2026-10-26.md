# Release candidate — Atelier editorial / 26.10.2026

Zmiana całej publicznej oprawy strony, nowa sekwencja przewijania Anime.js i publikacja istniejącego portfolio.

- Główna fotografia zatrzymuje się w ekranie, zmniejsza do pierwszego projektu i odsłania opis; sekwencja jest odwracalna.
- Dystans przewijania skrócony o 1/3: 115svh → 76.6667svh.
- Przycisk kontaktowy: „Napisz do Nas”.
- Włączone wszystkie 12 istniejących projektów, bez limitu liczby kart na stronie głównej. W aktywnym katalogu nie znaleziono Bema.
- Wariant telefonu bez długiego przypinania ekranu, reduced-motion i układ bez JavaScript.
- Zachowane CMS, zdjęcia, dane kontaktowe, formularz Netlify, canonical i zasady indeksowania.
- Font Space Grotesk lokalnie z licencją OFL.

Weryfikacja lokalna: build produkcyjny, typy i ESLint; 22 testy logiki. Finalny przebieg przeglądarkowy oraz wynik recenzji ruchu opisano w załączonych wynikach QA po zakończeniu kontroli.

Wydanie korzysta z istniejącego repozytorium i projektu Netlify cywinska-studio. Main wymaga PR, CMS content boundary, Netlify Deploy Preview i recenzji CODEOWNER. Nie zmieniono reguł ochrony ani dostępu. Źródła nie są wysyłane do Superdesign. Zastaną zmianę public/lp1.png pozostawiono lokalnie poza tym wydaniem.

Wynik końcowy QA: 105/105 kontroli przeglądarkowych, w tym wszystkie 12 galerii, pełna sekwencja scrolla i cofanie, krótszy dystans, nowa etykieta CTA, szerokości 390/768/1024/1440, live reduced-motion i fallback bez JS. Brak błędów JS i nieudanych zasobów. Build wygenerował wszystkie 12 stron projektów. Oba lockfile zawierają Anime.js 4.5.0 bez aktualizacji innych zależności. Poprawka z recenzji: tytuł portfolio odsłania się dopiero po zwolnieniu przestrzeni nad zdjęciem.
