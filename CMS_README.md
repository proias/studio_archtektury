# CMS Keystatic — Cywińska Studio

## Uruchomienie lokalne

Wymagane: Node.js 22 i pnpm 10.14.0.

```sh
corepack pnpm install
corepack pnpm dev --hostname 127.0.0.1
```

Panel: <http://127.0.0.1:3000/keystatic>. Domyślny storage to local; jawne `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github` włącza GitHub także lokalnie. Po zmianie zmiennych zrestartuj serwer. Dev zapisuje do `.next-dev`, a build do `.next`; katalogi są ignorowane przez Git. Ze względu na RAM nadal uruchamiaj build i Chrome kolejno.

## Edycja

- **Teksty strony głównej i katalogu**: nagłówki, wprowadzenia, podpisy sekcji, teksty przycisków, menu i stopki. Identyfikatory kotwic oraz techniczne adresy nawigacji pozostają w kodzie. Enter w polach wielowierszowych może oznaczać podział wiersza na stronie.
- **Logo i zdjęcie główne**: edytuj napisy logo lub wgraj plik PNG/WebP z przezroczystością. Znak jest wspólny dla nagłówka i stopki. Usuń plik, aby wrócić do napisów. Niezależne hero ma opis, kadrowanie i pozycję; brak uploadu oznacza okładkę pierwszego opublikowanego wyróżnionego projektu.
- **Projekty**: wszystkie 12 wpisów pozostaje w CMS. Publicznie dostępne są wyłącznie `published`; `draft` i `pending-confirmation` nie trafiają do katalogu, wyróżnień, nawigacji, sitemap ani publicznych detali. Detal szkicu zwraca 404 po deployu.
- **Status opisu**: `temporary` pokazuje publiczny komunikat „Opis tymczasowy — w przygotowaniu redakcyjnym”. Notatki redakcyjne są niepubliczne. Pierwszy projekt `dom-lodzkie-3` jest opublikowany na polecenie właściciela, pozostałe zachowują statusy. Propozycje opisów powstały na podstawie istniejących opisów wizualizacji; nie dopisano niepotwierdzonych faktów.
- **SEO projektu**: opcjonalny tytuł, opis i obraz udostępniania; puste pola korzystają z tytułu, opisu i okładki projektu.
- **Pracownia, kontakt i SEO**: dane kontaktowe, globalne metadane, akapity o pracowni, obszar działania, nawigacja i etapy współpracy.
- **Przekierowania starych adresów**: przed zmianą sluga zapisz dotychczasowy adres i nowy cel. Cele muszą być opublikowanymi stronami. Build odrzuca błędne reguły; nie ma automatycznego odzyskiwania wcześniejszego sluga. Szczegóły: [audyt adresów](docs/REDIRECT-AUDIT.md).

Zapis GitHub tworzy zmianę na wybranej gałęzi. Strona publiczna prezentuje treść ostatniego poprawnego wdrożenia Netlify; nowe adresy generuje build. Na `main` zapis może uruchamiać automatyczny release.

## GitHub App i Netlify

Aplikacja: `cywinska-studio-cms`; repozytorium: `proias/studio_archtektury`. Użytkownik CMS potrzebuje write do repozytorium. Instalację aplikacji ogranicz do tego repozytorium.

Callbacki:

- `https://cywinska-studio.pl/api/keystatic/github/oauth/callback`
- `http://127.0.0.1:3000/api/keystatic/github/oauth/callback`

Do utworzenia nowej aplikacji ustaw lokalnie tryb github i repo, otwórz panel i użyj Create GitHub App. Deployed App URL: `https://cywinska-studio.pl`. Kreator zapisuje Client ID, Client Secret, KEYSTATIC_SECRET i slug w `.env`. Puste wpisy w `.env.local` mogą je przesłaniać. Instrukcja: <https://keystatic.com/docs/github-mode>.

| Zmienna                               | Wartość                   | Zakres Netlify     |
| ------------------------------------- | ------------------------- | ------------------ |
| NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND    | github                    | Builds             |
| NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO     | proias/studio_archtektury | Builds             |
| NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG | cywinska-studio-cms       | Builds             |
| KEYSTATIC_GITHUB_CLIENT_ID            | z GitHub App              | Builds + Functions |
| KEYSTATIC_GITHUB_CLIENT_SECRET        | prywatny sekret           | Builds + Functions |
| KEYSTATIC_SECRET                      | prywatny losowy sekret    | Builds + Functions |

Sekrety są poza repozytorium i nigdy nie mają prefiksu NEXT*PUBLIC*. Produkcyjne lokalne API jest wyłączone; brak konfiguracji GitHub zwraca 503. Po zmianach zmiennych wykonaj nowy build. Komenda hostingu: `pnpm run build:netlify`, publish `.next`.

## Kontakt

Formularz wysyła URL-encoded POST do `/__forms.html` przez Netlify Forms. Statyczna definicja ma nazwę `kontakt-pracownia`; nazwy pól muszą być zgodne. Honeypot i filtr Netlify ograniczają spam. Przycisk blokuje podwójne wysyłanie, błędy zachowują dane, a sukces oznacza przyjęcie zgłoszenia przez usługę, nie przeczytanie e-maila.

`NEXT_PUBLIC_CONTACT_ENABLED=true` ustawia build Netlify w `netlify.toml`; zwykły lokalny dev nie udaje rzeczywistej wysyłki. Powiadomienia konfiguruj w Netlify Forms → Submission notifications. Odbiorcy nie są ustawieniem publicznego CMS. Integrację trzeba sprawdzić na wdrożeniu: zgłoszenie w panelu Forms oraz powiadomienie w skrzynce, również folder Spam. Dawny nieużywany endpoint `/api/contact` i adapter zostały usunięte.

## Indeksowanie i adresy

Canonical i mapa używają `https://cywinska-studio.pl`. `/sitemap.xml` wymienia stronę główną, katalog i opublikowane projekty; deploy previews emitują pustą mapę. Nie podajemy fikcyjnej daty aktualizacji przy każdym buildzie.

Indeksowanie pozostaje wyłączone. Dopiero jawne `SITE_INDEXING_ENABLED=true` razem z kontekstem Netlify `production` zmienia reguły robots oraz nagłówki. Samo ustawienie flagi na preview nie odblokowuje indeksowania. Panel, API i definicja formularza pozostają noindex. Włączenie indeksowania jest osobnym krokiem po zatwierdzeniu treści.

## Weryfikacja i dane

```sh
corepack pnpm exec tsc --noEmit
corepack pnpm lint
corepack pnpm format:check
corepack pnpm test
node scripts/cms-api-qa.cjs
node scripts/cms-resource-check.cjs
corepack pnpm build
```

E2E Chrome/CDP: `QA_URL` wskazuje serwer lub podgląd Netlify; `QA_OUT` ustala katalog raportu dla `node scripts/browser-qa.mjs`. Test formularza przechwytuje transport i nie wysyła realnych zapytań. Test rzeczywistej integracji Netlify jest osobny. Zmieniony test przeglądarkowy sprawdza publikację i 404 szkiców zamiast historycznego założenia, że wszystkie 12 detali jest publiczne.

Treści: `content/site.json`, `pages.json`, `appearance.json`, `redirects.json`, `projects/*.json`. Publiczne karty dostają wyłącznie dane potrzebne do renderowania, bez notatek redakcyjnych i archiwalnych praw. Wymiary obrazów są odczytywane pojedynczo i pamiętane; nie przechowujemy buforów zdjęć. Publiczny odczyt nie przetwarza galerii szkiców.

Archiwum sprzed migracji jest w `docs/archive/cms-before-migration.json`. Test historyczny sprawdza rzeczywisty skrypt migracji w wirtualnym filesystemie, bez porównywania każdej późniejszej edycji CMS do starych treści. Nie uruchamiaj ponownie `scripts/migrate-cms.cjs` na edytowanych danych. Jednorazowe przygotowanie opisów jest udokumentowane skryptem `scripts/prepare-release-content.cjs`; nie jest częścią buildu.
