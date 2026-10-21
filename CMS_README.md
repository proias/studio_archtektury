# CMS Keystatic — Cywińska Studio

## Lokalnie

Wymagane: Node.js 22 i pnpm 10.14.0 (na Windows można używać `corepack pnpm`).

```sh
corepack pnpm install
corepack pnpm dev
```

Panel: <http://localhost:3000/keystatic>. Domyślnie działa lokalnie, bez konta GitHub.
Opcjonalnie skopiuj `.env.example` do `.env.local`. Uruchamiaj serwer lokalny tylko na zaufanym komputerze.
Jawne `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github` włącza GitHub także w development, co pozwala skonfigurować aplikację GitHub.

## Edycja

- **Projekty**: wszystkie 12 istniejących projektów, tytuł, adres, kategoria, lokalizacja, rok, opis, galeria, okładka, kadrowanie, status, kolejność i notatki o autorstwie.
- **Pracownia, kontakt i SEO**: metadane, dane kontaktowe, obszar działania, akapity „O pracowni”, nawigacja oraz etapy współpracy.
- Kolejność galerii jest kolejnością zdjęć na stronie. Okładka jest osobnym polem; przy zmianie pierwszego zdjęcia można zaktualizować ją oddzielnie.
- Niższa wartość kolejności oznacza wcześniejszą pozycję. Puste wyróżnienie usuwa projekt ze strony głównej.
- Zachowano istniejące zasady podglądu: `draft` i `published` są widoczne w katalogu, `pending-confirmation` wyłącznie pod bezpośrednim adresem. To celowe zachowanie obecnego projektu, objęte testami.
- Przesyłaj obrazy w formatach obsługiwanych przez Next.js, najlepiej WebP/JPEG/PNG. Zdjęcia zapisują się pod `public/images/projects`, a odnośniki pod `/images/projects/...`. Wymiary adapter odczytuje automatycznie z pliku; historyczne pola szerokości i wysokości nie wymagają ręcznej edycji.
- Zachowaj adresy istniejących projektów. Zmiana adresu nie tworzy automatycznego przekierowania.

Zapis lokalny aktualizuje pliki robocze. W trybie GitHub zapis trafia do wybranej gałęzi repozytorium. Publiczna strona prezentuje treść z ostatniego poprawnego wdrożenia Netlify; po zmianie treści potrzebny jest build. Nowe projekty są generowane przez `generateStaticParams`.

## GitHub App i Netlify

Keystatic korzysta z **GitHub App** (jej Client ID i Client Secret), nie ze zwykłej samodzielnej OAuth App. Właściwy mechanizm i automatyczny kreator opisuje [dokumentacja GitHub mode](https://keystatic.com/docs/github-mode).

1. Repozytorium tej strony to `proias/studio_archtektury`. Użytkownik CMS potrzebuje dostępu **write**. Podłącz to samo repozytorium i odpowiednią gałąź do ciągłych wdrożeń Netlify.
2. Lokalnie ustaw `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github` i `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=proias/studio_archtektury`. Uruchom ponownie `pnpm dev`, otwórz `/keystatic` i skorzystaj z **Create GitHub App**. Kreator nada wymagane uprawnienia; zainstaluj App tylko dla właściwego repozytorium. Wskaż adres wdrożenia `https://cywinska-studio.pl`.
3. W ustawieniach GitHub App dodaj callback `https://cywinska-studio.pl/api/keystatic/github/oauth/callback`. Dla lokalnego logowania zachowaj callback utworzony przez kreator (`http://127.0.0.1:3000/api/keystatic/github/oauth/callback`). Dla osobnej domeny podglądu dodaj jej dokładny callback.
4. Kreator zapisuje Client ID, Client Secret, `KEYSTATIC_SECRET` i slug App w lokalnym pliku `.env`. Wartości przenieś do ustawień środowiska projektu Netlify. Nie zapisuj sekretów w repozytorium.
5. Ustaw poniższe zmienne dla właściwego kontekstu Netlify. Zmienne publiczne są potrzebne podczas **Builds**. Trzy prywatne zmienne są potrzebne w **Builds i Functions** (lub All scopes, jeżeli plan Netlify nie udostępnia wyboru zakresu). Włącz oznaczenie sekretu dla Client Secret i `KEYSTATIC_SECRET`.

| Zmienna                                 | Wartość                                            |
| --------------------------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND`    | `github`                                           |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`     | `proias/studio_archtektury`                        |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | slug utworzonej GitHub App                         |
| `KEYSTATIC_GITHUB_CLIENT_ID`            | Client ID GitHub App                               |
| `KEYSTATIC_GITHUB_CLIENT_SECRET`        | Client Secret GitHub App                           |
| `KEYSTATIC_SECRET`                      | losowy sekret z kreatora lub 32 losowe bajty w hex |

6. Wdróż kod i pliki `content/`, następnie otwórz <https://cywinska-studio.pl/keystatic> i zaloguj się przez GitHub. Sprawdź zapis na gałęzi oraz następujący po nim build Netlify. Dla gałęzi CMS można używać Deploy Previews i scalać zmiany do gałęzi produkcyjnej po sprawdzeniu.

Bez ustawienia trybu GitHub konfiguracja używa `local`, ale produkcyjne endpointy lokalnego zapisu są wyłączone (HTTP 503). Sama obecność panelu nie oznacza skonfigurowanego logowania. Brak sekretów w produkcyjnym trybie GitHub również zwraca 503. Sekrety nie są używane w konfiguracji przesyłanej do przeglądarki. Po zmianie zmiennych publicznych wykonaj nowy build.

## Dane i migracja

Źródło treści stanowią `content/projects/*.json` oraz `content/site.json`. `lib/cms/reader.ts` korzysta z Keystatic Reader API i zwraca dotychczasowe typy `Project` / `ProjectImage`. `lib/projects.ts` pozostaje wspólnym modułem typów i kategorii dla klienta. `lib/site-content.ts` udostępnia dane singletonu przez import JSON, także komponentom klienckim.

Stare `lib/project-catalog.json`, `lib/image-manifest.json` oraz archiwum `docs/` pozostają jako materiał audytowy. Nie edytuj ich w celu zmiany strony. Kopia pełnego kontraktu sprzed migracji znajduje się w `docs/archive/cms-before-migration.json`. Skrypt `scripts/migrate-cms.cjs` został wykonany jednokrotnie; korzysta z tej kopii i odmawia nadpisania istniejących plików. Nie uruchamiaj go ponownie na edytowanej treści.

Panel i część publiczna mają osobne root layouty `(cms)` i `(site)`. Przejście między nimi przeładowuje dokument, izolując globalny Tailwind i fonty. `global-not-found.tsx` zachowuje publiczny widok 404 w układzie wielu root layoutów. API działa dynamicznie w Node.js; strony portfolio pozostają statyczne. `dynamicParams=false` ogranicza detale do adresów wygenerowanych podczas buildu: edycja Git uruchamia nowy build. Nie wymuszamy kopiowania `public/images` do każdej funkcji API. Optymalizacja Next Image / Netlify Image CDN pozostaje włączona.

Wymiary obrazów są odczytywane w jednej kolejce i zapamiętywane bez buforów zdjęć. Development sprawdza znacznik modyfikacji i rozmiar pliku, więc zastąpienie zdjęcia pod tym samym adresem odświeża jego wymiary. Lista slugów i nawigacja nie odczytują zdjęć; metadane strony odczytują tylko jedną okładkę. Build korzysta z maksymalnie dwóch workerów generujących strony i optymalizacji pamięci webpacka.

## Weryfikacja

```sh
corepack pnpm exec tsc --noEmit
corepack pnpm lint
corepack pnpm format:check
corepack pnpm test
corepack pnpm build
# W osobnym terminalu: corepack pnpm start
corepack pnpm test:browser
```

Testy Node obejmują porównanie migracji z kopią wejściową. Po celowej zmianie treści należy odpowiednio zaktualizować oczekiwania testów danych; historycznej kopii nie używaj jako źródła bieżącej treści. Testy Chrome/CDP czytają katalog CMS. `QA_URL` zmienia adres serwera, a `QA_OUT` katalog raportów. Skrypt przeglądarkowy korzysta z lokalnego Chrome na Windows.

Na komputerze z ograniczoną pamięcią uruchamiaj powyższe kroki kolejno. Nie uruchamiaj buildu równolegle z `dev` ani testami Chrome. Domyślny próg startu Chrome to 1 GiB wolnego RAM. Opcjonalny tryb ograniczony `QA_MIN_FREE_MIB=512` obniża go do 512 MiB; obu wariantów pilnuje monitor kończący własne procesy Chrome, jeśli wolna pamięć spadnie poniżej 128 MiB. Profile i procesy testowe są sprzątane po teście. Test CMS rozgrzewa trasy przed uruchomieniem Chrome i ponownie sprawdza wolną pamięć. Lekki pomiar adaptera, bez serwera i przeglądarki: `node scripts/cms-resource-check.cjs`. Test faktycznych handlerów zapisu, bez serwera i Chrome: `node scripts/cms-api-qa.cjs`; tymczasowo zmienia tytuł singletonu i przywraca oryginalne bajty pliku. Audyt i ograniczenia pomiarów: [docs/CMS-RESOURCES.md](docs/CMS-RESOURCES.md).
