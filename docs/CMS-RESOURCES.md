# Audyt zasobów CMS — 20.10.2026

Audyt wykonano po przerwaniu pracy przez awarię środowiska. Nie ustalono bezpośredniej przyczyny crasha VS Code. Zaobserwowano natywną awarię workera Next.js, a następnie komunikat webpacka `Array buffer allocation failed`. System ma 7,42 GiB RAM; podczas audytu dostępne było około 0,37 GiB. Nie pozostały uruchomione procesy testowe Node/Chrome. Nie zamykano aplikacji użytkownika.

## Znaleziony i usunięty narzut

| Obszar                         | Przed audytem                                                          | Po zmianie                                                                          |
| ------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Odczyt wymiarów                | 53 wywołania dla pełnego katalogu, ponawiane przy następnych odczytach | 41 unikalnych plików; cache samych wymiarów                                         |
| Równoległość natywnego odczytu | `Promise.all` dla całego katalogu                                      | jedna kolejka na proces                                                             |
| Generowanie slugów             | mapowanie całych projektów i zdjęć                                     | tylko lista slugów Reader API                                                       |
| Nawigacja następnego projektu  | odczyt całego katalogu z obrazami                                      | tylko slug i tytuł                                                                  |
| Globalne SEO                   | mapowanie wszystkich galerii                                           | jedna wybrana okładka                                                               |
| Strona główna                  | mapowanie całego katalogu                                              | mapowanie wyróżnionych projektów                                                    |
| Bundlowanie funkcji            | wymuszone dołączenie wszystkich obrazów do wszystkich tras             | brak globalnego dołączania obrazów; publiczne detale są SSG z `dynamicParams=false` |
| Zależność `20`                 | nieużywany, zastany system Angular/Gulp                                | usunięta; pnpm usunął 454 pakiety                                                   |
| Kontrole                       | kompilacja, lint i Chrome częściowo równolegle                         | ciężkie etapy kolejno                                                               |
| Chrome QA                      | brak kontroli wolnej pamięci; ubijany tylko główny proces              | minimum 1 GiB wolnego RAM, sprzątanie drzewa własnego procesu i profilu             |

`@keystatic/core` i `@keystatic/next` są potrzebne do panelu oraz Reader API. `sharp` obsługuje automatyczne wymiary uploadów i jest także opcjonalną zależnością Next.js — aktualny lockfile używa jednej wersji 0.35.5. Nie dodano bazy danych, Redisa, serwera CMS ani procesu synchronizacji działającego w tle. Panel i jego interfejs są odseparowane od publicznego layoutu; sam build/development musi jednak skompilować panel, co ma realny koszt pamięci.

Pozostałe zastane komponenty Radix i ich zależności nie były masowo usuwane: istnieją pliki komponentów, które je importują. Ich obecność w `package.json` nie oznacza, że wszystkie są ładowane na publicznej stronie. Ewentualne usunięcie niewykorzystywanego zestawu komponentów wymaga osobnego sprawdzenia użycia; nie jest potrzebne do działania CMS.

## Pomiar po optymalizacji

`node scripts/cms-resource-check.cjs` uruchamia pojedynczy proces, bez Next dev, webpacka i przeglądarki. Wynik: [qa-cms/resources.json](qa-cms/resources.json).

- 12 projektów i 41 unikalnych zdjęć.
- 41 natywnych odczytów łącznie po dwukrotnym pobraniu całego katalogu oraz pobraniu wyróżnień i okładki.
- Maksymalnie jeden natywny odczyt jednocześnie.
- Lista slugów i nawigacja: zero natywnych odczytów obrazów.
- Szczyt RSS tego procesu: 75 MiB. **To pomiar adaptera, nie całego CMS, serwera development, buildu ani przeglądarki.**

Testy Node po optymalizacji: 12/12, w tym odświeżanie wymiarów po zastąpieniu pliku obrazu. Po optymalizacji przeszedł pełny build Next.js 15.5.28, także po poprawce inicjalizacji API; wygenerowano wszystkie 12 detali. Śledzenie plików tras API kontaktu i Keystatic wykazało zero obrazów z `public/images` w ich listach zależności.

Test faktycznych eksportów GET/POST w `scripts/cms-api-qa.cjs` przeszedł 9/9: lokalny zapis, Reader API, odczyt blobu, przywrócenie oryginalnych bajtów, walidacja ścieżek i blokada lokalnych odczytów oraz zapisów w produkcji. Osobno potwierdzono, że niepełne dane GitHub zwracają 503 zamiast błędu inicjalizacji modułu. Handler jest tworzony dopiero po sprawdzeniu dostępności konfiguracji.

Końcowa weryfikacja została zamknięta 21.10.2026 po zwolnieniu pamięci przez użytkownika. Testy Chrome/CDP strony produkcyjnej przeszły ponownie 85/85, a testy rzeczywistego panelu CMS 10/10: lista projektów, pobranie istniejących zdjęć, zapis singletonu, aktualizacja strony i izolacja CSS w obu kierunkach. Siedem publicznych zrzutów ponownie było identycznych bajt po bajcie z poprzednimi artefaktami QA. Oryginalna treść została przywrócona po testach. Wyniki: [public/browser-results.json](qa-cms/public/browser-results.json), [cms-browser-results.json](qa-cms/cms-browser-results.json), [visual-comparison.json](qa-cms/visual-comparison.json).

Wcześniejszą próbę Chrome poprawnie zatrzymał próg startu przy 292 MiB wolnego RAM. Wariant development z heapem 512 MiB okazał się za mały do kompilacji i renderowania panelu (OOM wyłącznie procesu Node). Weryfikację panelu przeprowadzono z limitem 768 MiB, a kompilację, serwer i przeglądarkę uruchamiano kolejno. Test oczekuje na zakończenie zapisu, pełne ładowanie dokumentu i fontów oraz obsługuje potwierdzenie opuszczenia już zapisanego formularza.

Domyślny próg startu testów przeglądarkowych wynosi 1 GiB; można użyć `QA_MIN_FREE_MIB=512` przy samodzielnie uruchomionym serwerze. Poniżej 512 MiB test nie startuje, a aktywny monitor zatrzymuje wyłącznie własne drzewo procesów Chrome przy mniej niż 128 MiB wolnego RAM. Zrzuty PNG QA w `docs/qa*` zostały dodane do `.gitignore`: Keystatic lokalnie skanuje i haszuje repozytorium z uwzględnieniem tego pliku, więc pomija teraz 31,8 MiB wygenerowanych obrazów testowych. Istniejące pliki i śledzone artefakty nie zostały usunięte.

Next.js 15 obsługuje `experimental.webpackMemoryOptimizations`; według [dokumentacji Next.js](https://nextjs.org/docs/app/guides/memory-usage) ogranicza to szczyt pamięci kosztem możliwego niewielkiego wydłużenia kompilacji. Worker webpacka pozostaje włączony. Liczbę workerów generujących strony ograniczono do dwóch.
