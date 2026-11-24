# Audyt wymagań projektu — 28.10.2026

## Zakres i sposób odczytu statusów

Przegląd kodu aplikacji, konfiguracji Next.js/Netlify, danych CMS, dokumentacji i istniejących testów. W tej rundzie uruchomiono TypeScript, ESLint i testy Node; nie wykonywano wdrożenia ani testów przeciw produkcji.

- **Spełnione** — potwierdzone w kodzie i/lub testach.
- **Częściowe** — istnieje dobra podstawa, ale brakuje pomiaru, konfiguracji zewnętrznej lub pełnej weryfikacji.
- **Do decyzji** — wymaga faktów lub zatwierdzenia właściciela; nie należy zgadywać ani deklarować spełnienia.

To techniczna lista kontrolna, nie certyfikat WCAG ani porada prawna.

## Checklista i wynik

| Obszar | Wymaganie | Stan i dowód |
|---|---|---|
| SEO techniczne | Unikalny tytuł i opis strony, stabilny canonical, polski język dokumentu | **Spełnione.** Metadane layoutu i stron, canonical strony głównej, katalogu, detali i prywatności; `<html lang="pl">`. |
| SEO techniczne | Sitemap tylko dla publicznych adresów, robots zależne od środowiska, podglądy i API poza indeksem | **Spełnione.** `app/sitemap.ts`, `app/robots.ts`, nagłówki `X-Robots-Tag`; testy sprawdzają środowisko produkcyjne i preview. |
| SEO wdrożeniowe | Jawna decyzja, czy produkcja ma być indeksowana | **Potwierdzone 28.10.2026: włączyć indeksowanie.** Bieżący `netlify.toml` ustawia `SITE_INDEXING_ENABLED=true` dla produkcji i odpowiada decyzji właściciela. Raport release z 22.10 opisywał wcześniejszy stan; sprawdzić wynikowy `robots.txt` po kolejnym wdrożeniu. |
| SEO treści | Opisy stron, metadane Open Graph/Twitter, dane strukturalne zgodne z publiczną ofertą | **Spełnione w kodzie.** Strona główna emituje `WebSite` i `ProfessionalService`; JSON-LD ucieka znak `<`. Projekty korzystają z pól SEO CMS lub wartości zastępczych. |
| SEO operacyjne | Weryfikacja Search Console, indeksacji, błędów crawlowania, rich results i zapytań | **Częściowe.** Tego nie da się potwierdzić samym kodem; brak dowodu z konta wyszukiwarki w tej rundzie. |
| SEO regionalne | Spójny NAP, obszar działania i dane firmy | **Częściowe.** Dane kontaktowe, adres i obszary są w treści oraz JSON-LD. Nie weryfikowano ich z wizytówką Google ani dokumentami firmy. |
| Dostępność | Semantyczny HTML, skip link, hierarchia nagłówków, etykiety, teksty alternatywne | **Spełnione w przeglądzie kodu.** Formularz ma etykiety, błędy i status; CMS ma pola alt. Test katalogu wykrywa brak alt. |
| Dostępność | Obsługa klawiaturą, fokus, dialog galerii, ograniczenie animacji | **Częściowe.** Kod obsługuje fokus, klawisze galerii i `prefers-reduced-motion`; istnieją historyczne wyniki QA przeglądarkowego. Pełnego testu czytnikiem ekranu i powiększeniem nie wykonano w tej rundzie. |
| Dostępność | Kontrast WCAG 2.2 AA i pełna zgodność wszystkich ścieżek | **Częściowe.** Historyczny audyt ręczny odnotował poprawiony kontrast tekstu pomocniczego (4,554:1). Nie jest to audyt całego interfejsu ani certyfikacja AA. |
| Wydajność | Responsywne, zoptymalizowane obrazy, lokalne fonty, ograniczenie pracy klienta | **Spełnione jako implementacja.** Używane jest `next/image`, fonty są lokalne, ruch respektuje ustawienie systemowe; treści projektów czytane są z CMS przez adapter. |
| Wydajność | Rzeczywiste Core Web Vitals, Lighthouse i pomiar na urządzeniach/łączu mobilnym | **Częściowe.** Nie wykonano pomiaru produkcyjnego w tej rundzie. Wcześniejszy audyt wskazuje około 1,66 MB fontów TTF przed kompresją; warto sprawdzić WOFF2 z polskim zakresem znaków i porównać transfer/LCP. |
| Bezpieczeństwo | Brak sekretów w kliencie i repozytorium, walidacja wejścia i bezpieczne granice CMS | **Spełnione według przeglądu kodu.** Sekrety Keystatic nie mają prefiksu `NEXT_PUBLIC_`; `.env*` jest ignorowane z wyjątkiem przykładu. API preview waliduje ścieżkę i gałąź; reguły przekierowań odrzucają pętle i zewnętrzne cele. Workflow CMS ogranicza zmiany redakcyjne do treści i obrazów. |
| Bezpieczeństwo | Bazowe nagłówki HTTP | **Spełnione po tej rundzie.** Dodano HSTS `max-age=31536000` i `Permissions-Policy` blokującą kamerę, mikrofon i geolokalizację; zachowano `nosniff` oraz `Referrer-Policy`. Konfiguracja Next.js i Netlify jest spójna, a test weryfikuje nagłówki aplikacji. |
| Bezpieczeństwo | Content Security Policy | **Do zaprojektowania.** CSP nie dodano celowo: polityka wymaga sprawdzenia skryptów/zasobów Next.js, CMS, adaptera i Image CDN. Najpierw należy uruchomić `Content-Security-Policy-Report-Only`, zebrać naruszenia i dopiero potem rozważyć egzekwowanie. |
| Prywatność i prawo | Informacja o administratorze, podstawach, celach, odbiorcach, retencji, prawach i cookies | **Uzupełnione w kodzie; wymaga potwierdzenia konfiguracji usługi.** [Polityka RODO](<../app/(site)/prywatnosc/page.tsx>) opisuje administratora, obsługę zapytania, podstawy, kryteria retencji, prawa i użycie Netlify. Przed publikacją należy porównać opis transferów i retencji technicznej z aktywną konfiguracją i warunkami dostawcy. |
| Prywatność i prawo | Zgody cookies i zewnętrzne skrypty | **Częściowe.** Polityka deklaruje brak analityki i osadzonych map/opinii; mapy są linkiem zewnętrznym. Należy ponownie sprawdzić stan faktyczny przed dodaniem analityki, reklam, embedów lub innych cookies. Nie dodawać banera zgód bez ustalenia, czy strona używa niekoniecznych cookies. |
| Treść i prawa | Publikacja wyłącznie zatwierdzonych projektów, alt-y i brak pustych opisów | **Spełnione dla obecnego zbioru.** Kontrola danych: 12/12 opublikowanych, 12/12 z `contentStatus=approved`, 41 obrazów i brak pustych alt-ów/opisów. Testy CMS potwierdzają filtrowanie publikacji. |
| Treść i prawa | Potwierdzone autorstwo/licencje zdjęć i projektów | **Potwierdzone przez właścicielkę.** Wszystkie 12 rekordów CMS oznaczono jako autorstwo własne, z notatką, że prawa i zakres publikacji określają zawarte umowy. Zachować umowy w dokumentacji firmowej; nie umieszczać ich w repozytorium. |
| Zgodność usług online | Informacja o zasadach korzystania, wymaganiach technicznych i reklamacjach | **Dodano.** [Regulamin strony](<../app/(site)/regulamin/page.tsx>) opisuje stronę i formularz, rozdziela zapytanie od zawarcia umowy projektowej oraz wyjaśnia, że umowy projektowe są podpisywane osobiście. |
| Formularz | Walidacja, dostępne błędy, ochrona antyspamowa i jawne potwierdzenie przyjęcia | **Spełnione w kodzie i testach.** Walidacja Zod, honeypot, timeout, blokada wielokrotnej wysyłki i sprawdzenie nagłówka potwierdzenia Netlify; błędy nie są przedstawiane jako sukces. |
| Niezawodność | Typecheck, lint, testy regresji i budowanie produkcyjne | **Spełnione dla kodu lokalnego.** W tej rundzie `typecheck`, `lint`, formatowanie, 24/24 testy Node i produkcyjny build przeszły. Nie jest to nowy test bieżącego wdrożenia produkcyjnego. |
| Operacje | Dostępność, powiadomienia formularza, backup CMS, proces publikacji i monitoring | **Wymaga odbioru zewnętrznego.** Zależy od konfiguracji Netlify/Keystatic/GitHub i kont właściciela; repozytorium nie potwierdza bieżących powiadomień e-mail, monitoringu ani odtworzenia backupu. |

## Działania wykonane w tej rundzie

1. Dodano HSTS bez `includeSubDomains` ani `preload`, aby nie zakładać konfiguracji innych hostów.
2. Ograniczono uprawnienia przeglądarki do kamery, mikrofonu i geolokalizacji; strona nie potrzebuje tych funkcji.
3. Dodano test spójności nagłówków aplikacji. Konfiguracja nagłówków jest też odzwierciedlona w `netlify.toml`.
4. Zaktualizowano status autorstwa wszystkich 12 projektów na podstawie potwierdzenia właścicielki; szczegóły umów pozostają poza repozytorium.
5. Dodano osobną podstronę regulaminu, rozszerzono informację RODO i podłączono obie strony w stopce oraz sitemapie.

## Kolejność dalszych prac

1. Porównać informacje o Netlify, transferach i retencji z aktywną konfiguracją oraz warunkami dostawcy; w razie potrzeby skonsultować treść prawną.
2. Wykonać kontrolę produkcyjną: aktualne nagłówki, canonical/sitemap/robots, przekierowanie `www`, indeksowanie i formularz — bez wysyłania testowego zapytania bez zgody.
3. Zmierzyć Core Web Vitals na produkcji; rozważyć WOFF2 dopiero po porównaniu jakości i transferu.
4. Jeżeli potrzebne, przetestować CSP w trybie Report-Only przed egzekwowaniem.
