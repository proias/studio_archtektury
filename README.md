# Paulina Cywińska — lokalna wersja portfolio

Next.js 15 App Router, TypeScript, Tailwind CSS 4 i Radix. Wersja robocza; nie opublikowano na produkcji.

## Uruchomienie

Wykryty menedżer: pnpm 10.14.0 (node_modules/.modules.yaml i struktura .pnpm). Używany jest pnpm-lock.yaml; package-lock.json zachowano bez zmian jako zastany plik. Nie uruchamiać instalacji oboma menedżerami.

- corepack pnpm install --frozen-lockfile
- corepack pnpm dev --hostname 127.0.0.1
- Podgląd: http://127.0.0.1:3000
- Produkcyjna kompilacja lokalna: corepack pnpm build, następnie corepack pnpm start --hostname 127.0.0.1

## Sprawdzenia

- corepack pnpm typecheck
- corepack pnpm lint
- corepack pnpm test
- corepack pnpm build
- corepack pnpm test:browser (wymaga działającej strony oraz Chrome na Windows; domyślnie port 3000, opcjonalna zmienna QA_URL)

Testy przeglądarkowe używają osobnego tymczasowego profilu Chrome bez okna. Nie korzystają z prywatnego profilu użytkownika ani nie wysyłają korespondencji. Raport i zrzuty są w docs/qa.

## Treści i obrazy

Katalog 12 nowych projektów: lib/project-catalog.json; model i selekcja: lib/projects.ts. Treści firmy: lib/site-content.ts. Powiązanie wszystkich 41 nowych źródeł z plikami docelowymi, rozmiary, wagi i teksty alternatywne: lib/image-manifest.json. Kopie WebP znajdują się w public/images/projects. Źródła pozostały bez zmian. Eksport można odtworzyć poleceniem node scripts/export-images.mjs „ścieżka do źródłowego folderu portfolio” (użyć zwykłych cudzysłowów w terminalu). Fonty są lokalne w app/fonts, razem z licencjami OFL.

Jeżeli na Windows wystąpi błąd podwójnego React i ostrzeżenia o C:/ds oraz C:/DS, skrypt node scripts/repair-windows-links.mjs naprawia wyłącznie wielkość liter w dowiązaniach node_modules wskazujących do tego checkoutu. Nie zmienia źródeł ani wersji pakietów.

## Odbiór

Raport: docs/RAPORT-WDROZENIA.md. Otwarte konfiguracje: docs/INTEGRACJE-I-PRZEKAZANIE.md. Lista do Pauliny: docs/DO-POTWIERDZENIA-Z-PAULINA.md. CMS, serwerowa wysyłka i automatyczne opinie Google nie są gotowymi integracjami.


## Aktualizacja: nowe portfolio i Netlify

Aktualny katalog używa wyłącznie 12 folderów „nowe portfolio” i 41 obrazów. Na liście jest 11 projektów; nierozstrzygnięta przebudowa kostki pozostaje pod bezpośrednim adresem /projekty/dom-kostka-przebudowa.

Next.js i eslint-config-next zaktualizowano punktowo do 15.5.28. Polecenie lint korzysta z ESLint CLI. Konfiguracja Netlify znajduje się w netlify.toml. build:netlify odrzuca CONTEXT=production; wersja jest przygotowaniem do podglądu, bez publikacji.

Aktualne dokumenty: docs/RAPORT-NETLIFY-I-NOWE-PORTFOLIO.md, docs/NETLIFY-ANALIZA-I-WDROZENIE.md, docs/AUDYT-FRONTEND-IMPECCABLE.md i docs/NOWE-PORTFOLIO.md. Wcześniejszy raport wdrożenia opisuje historyczny stan pierwszej wersji.
