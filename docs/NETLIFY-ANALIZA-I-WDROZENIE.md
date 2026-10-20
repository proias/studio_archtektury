# Netlify — analiza platformy i przygotowanie wdrożenia

Stan: 20.10.2026. Prace dotyczą istniejącego repozytorium i przygotowania wersji roboczej. Nie wykonano publikacji, push do repozytorium ani zmiany ustawień serwisu na Netlify.

## Zidentyfikowany projekt

Odczyt przez plugin Netlify potwierdził projekt cywinska-studio, identyfikator 786b0865-db81-42ea-8b96-001272848e53 i domenę https://cywinska-studio.pl. Zastany deploy miał stan ready. Wykrywanie Forms jest włączone, ale odczyt listy formularzy zwrócił pustą listę. Dostęp do witryny nie jest chroniony hasłem ani logowaniem zespołu. Nie odczytywano treści zapytań ani sekretów.

## Ocena wszystkich wskazanych elementów platformy

| Element | Decyzja dla tej wersji | Uzasadnienie i przygotowanie |
|---|---|---|
| Functions | Obsługa przez adapter Next.js | Trasa /api/contact pozostaje Route Handlerem. OpenNext przygotowuje funkcję serwerową; nie dublujemy jej osobnym handlerem. Odpowiedzi kontaktu mają jawne no-store, wspólną walidację i 503 bez dostawcy. |
| Edge Functions | Obecnie zbędne | Nie ma logowania, geolokalizacji ani personalizacji. Jeżeli później potrzebne będzie middleware Next, adapter dostarczy właściwą funkcję. Nie dodano globalnego przechwytywania wszystkich zasobów. |
| Blobs | Opcja dla późniejszego CMS | Obrazy są obecnie wersjonowanymi plikami. Blobs ma sens po dodaniu uploadu lub cache danych; podglądy muszą używać oddzielnego zakresu, np. getDeployStore, ponieważ zwykły getStore współdzieli dane między kontekstami. |
| Database | Obecnie niewymagana | Portfolio jest katalogiem odczytywanym z danych. Baza byłaby potrzebna dla relacji, ról redaktorów lub transakcyjnych operacji CMS; wymaga wtedy migracji i izolacji środowisk. Nie utworzono bazy ani nie dodano ORM. |
| Identity | Do decyzji z CMS | Nie ma aplikacyjnego logowania. Identity nie zastępuje panelu CMS ani ochrony całego podglądu. Konfiguracja logowania i uprawnień wymaga osobnego etapu; nie włączono rejestracji. |
| Image CDN | Przygotowane | Włączono optymalizację next/image. OpenNext na Netlify kieruje ją do Image CDN. Źródła są lokalne, z wymiarami i sizes; brak otwartej listy zewnętrznych domen. Lokalnie działa optymalizator Next. |
| Forms | Przygotowana definicja, wysyłka nieaktywna | public/__forms.html zawiera statyczny schemat wszystkich pól i honeypot. W Next.js sam atrybut w komponencie nie zapewnia rejestracji. UI nadal jawnie otwiera program pocztowy. Włączenie AJAX, rejestracja formularza i powiadomień oraz test rzeczywistego dostarczenia wymagają dalszej konfiguracji. |
| Config | Zapisane w repozytorium | netlify.toml: .next, build:netlify, Node 22, pnpm 10.14.0 i dev na 8888 z framework=#custom. .netlify jest ignorowane. Nagłówki Next/API są również w kodzie, ponieważ nagłówki dla statycznego CDN nie zastępują nagłówków odpowiedzi funkcji. Brak reguły SPA /* do index.html. |
| Caching | Cache adaptera i statycznych zasobów | Korzystamy z mechanizmów Next/OpenNext. Dane kontaktowe nie są cache’owane. Nie dodano osobnego cache ani purge endpointu. Rzeczywiste trafienia CDN trzeba sprawdzić na przyszłym podglądzie przez Cache-Status; lokalny test nie dowodzi działania edge cache. |
| Frameworks | Next App Router i OpenNext | Zachowano istniejącą aplikację. Adapter jest wykrywany automatycznie, bez przypięcia jego wersji w package.json. Punktowo zaktualizowano Next i eslint-config-next do 15.5.28, pozostawiając React i pozostałą aplikację. |
| AI Gateway | Niewymagany w portfolio | Brak funkcji AI, które pomagałyby odwiedzającemu w obecnym zadaniu. Nie dodano chatbota, SDK, sekretów ani generowania wizualizacji. Gdy powstanie konkretna potrzeba, wywołania powinny być po stronie serwera, z limitami kosztów. |
| Deployment | Przygotowane do dalszego podglądu, produkcja zablokowana | Skrypt odrzuca CONTEXT=production. Konteksty robocze budują stronę z noindex. Nie zarejestrowano nowego projektu i nie przesłano żadnego deployu. Pierwszym zewnętrznym krokiem powinien być chroniony podgląd na istniejącym projekcie po zleceniu jego publikacji. |

## Zmiany w kodzie

- netlify.toml i scripts/netlify-build.mjs — konfiguracja, lokalna emulacja oraz blokada produkcji.
- next.config.mjs — aktywna optymalizacja obrazów, noindex, nosniff i Referrer-Policy.
- lib/deployment.ts i app/layout.tsx — adresy Open Graph zgodne z aktualnym adresem podglądu, zamiast localhost na Netlify.
- app/api/contact/route.ts — no-store na wszystkich odpowiedziach.
- public/__forms.html — statyczna definicja do przyszłej rejestracji.
- package.json i pnpm-lock.yaml — wyłącznie punktowa aktualizacja Next.js i jego konfiguracji ESLint; lint uruchamiany bez przestarzałego next lint. package-lock.json pozostaje nietknięty.
- scripts/windows-netlify-links.cjs — pomocnicza zgodność lokalnego pakowania na Windows; nie jest częścią aplikacji i niczego nie zmienia na Linux.
- tests/deployment.test.cjs — test adresów, blokady produkcji i pól Forms.

## Wersje i bezpieczeństwo

Oficjalny komunikat Next.js z 14.10.2026 wskazuje 15.5.28 jako poprawioną linię 15.x. Wersję zweryfikowano w npm przed instalacją. Biblioteka sharp faktycznie używana wewnątrz Next ma wersję 0.35.5; stara hoistowana kopia narzędzia eksportu obrazów nie jest optymalizatorem serwera Next.

Źródło: [komunikat Next.js](https://nextjs.org/blog/nextjs-security-update-october-14-2026).

## Zmienne środowiskowe i sekrety

Do obecnego podglądu nie są potrzebne sekrety. NODE_VERSION i PNPM_VERSION są ustawieniami kompilacji. DEPLOY_PRIME_URL, DEPLOY_URL i URL służą do wyboru adresu metadanych; nie przechowują danych uwierzytelniających.

Przyszłe sekrety dostawcy kontaktu/CMS należy ustawiać w Netlify dla odpowiednich kontekstów i zakresów Builds oraz Functions. Nie używać NEXT_PUBLIC_ dla sekretów. Zmiana wartości wymaga nowej kompilacji i wdrożenia. Nie odczytywano ani nie zapisywano sekretów na koncie.

## Dalsze kroki przed publikacją

1. Zatwierdzić materiały z Pauliną i ustalić docelową listę publiczną, podpisy autorstwa, opisy oraz metadane.
2. Wybrać i wykonać CMS z logowaniem, uprawnieniami, magazynem obrazów i modelem publikacji.
3. Podłączyć kontakt do wybranej usługi. Dla Netlify Forms: AJAX do statycznego /__forms.html, obsługa błędów i stanu oczekiwania, potwierdzenie rejestracji i test dostarczenia na skrzynkę. Zgodność nazw pól jest obowiązkowa.
4. Zatwierdzić prywatność i retencję zapytań oraz ochronę dostępu do podglądu. Noindex nie jest ochroną prywatności.
5. Na zleconym później zewnętrznym podglądzie sprawdzić funkcje, Image CDN, Cache-Status, bezpośrednie trasy, 404 i kontakt.
6. Dopiero po odbiorze przygotować osobną zmianę odblokowującą produkcję, canonical, mapę strony i indeksację. Obecne przygotowanie nie jest zgodą na opublikowanie.

## Źródła

- [Next.js na Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [Formularze Next.js i OpenNext](https://opennext.js.org/netlify/forms)
- [Cache Netlify](https://docs.netlify.com/build/caching/caching-overview/)
- Pozostałe elementy oceniono na podstawie kontekstów pluginu Netlify dla functions, edge-functions, blobs, database, identity, image-cdn, forms, config, caching, frameworks, ai-gateway i deploy.


## Weryfikacja lokalna

Lokalne netlify build --offline --context deploy-preview zakończyło się kodem 0: Next.js 15.5.28, @netlify/build 37.5.0, adapter OpenNext 5.16.3, wygenerowana i spakowana funkcja ___netlify-server-handler. Log: docs/qa-netlify/netlify-build-verified.log. Było to pakowanie lokalne, bez uploadu. Zewnętrzne działanie CDN, retencja Forms, powiadomienia i uprawnienia nie zostały tym testem potwierdzone.

Na Windows pierwsze próby blokował brak prawa tworzenia symlinków. Pomocnik scripts/windows-netlify-links.cjs używa złączy katalogów w .next/standalone i dereferencji przy kopiowaniu do .netlify/functions-internal. Jest ładowany wyłącznie przez lokalne NODE_OPTIONS. Nie zmienia uprawnień systemu; na Linux nie stosuje obejścia.

Odtworzenie na Windows w PowerShell:

    $env:NODE_OPTIONS = "$env:NODE_OPTIONS --require=C:/DS/studio_archtektury/scripts/windows-netlify-links.cjs"
    corepack pnpm@10.14.0 --package=netlify-cli@27.13.0 dlx netlify build --offline --context deploy-preview

Dla zwykłego podglądu wystarczy standardowy build/start Next.js, bez tego pomocnika.
