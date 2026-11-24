const fs=require('fs');const body=`Nowy showroom architektoniczny prowadzi od pełnego kadru domu do portfolio przez sekwencję sterowaną przewijaniem. Zdjęcie zatrzymuje się, zmniejsza i odsłania opis projektu; cofanie przewijania odwraca ruch.

- Dystans głównej sekwencji krótszy o 1/3; przycisk „Napisz do Nas”.
- Wszystkie 12 istniejących projektów opublikowane i widoczne na stronie głównej oraz w katalogu; Bema nie występuje w aktywnych danych.
- Nowa oprawa editorial, lokalny Space Grotesk, wariant mobilny bez długiego przypinania, reduced-motion i fallback bez JavaScript.
- Zachowane CMS, fotografie, kontakt i obsługa Netlify Forms. Dotychczasowy obraz z ustawień wyglądu opisany w CMS jako ilustracja pracowni.

Walidacja: production build, typy, ESLint, formatowanie, 22 testy logiki oraz 105 kontroli Chrome (4 szerokości, wszystkie galerie, ruch w obie strony, CTA, klawiatura i atrapy wysyłki formularza). Recenzja wizualna: poprawka kolizji tytułu w środku przejścia rozwiązana.

Dokumentacja: docs/RELEASE-ATELIER-2026-10-26.md. Nie zmieniono zasad indeksowania, ochrony main ani dostępu do strony.`;fs.writeFileSync('.superdesign/release-pr.json',JSON.stringify({title:'Release: nowy showroom, animacje scrolla i pełne portfolio',head:'release/atelier-scroll-2026-10-26',base:'main',body,draft:false}));
