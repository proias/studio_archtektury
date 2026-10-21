# Keystatic — odbiór wdrożenia w projekcie

Weryfikacja końcowa: 21.10.2026.

## Zakres

- Keystatic 0.6.9 i integracja Next 5.0.5; Next.js 15.5.28 pozostaje bez zmiany wersji.
- Bezstratna migracja 12 projektów i singletonu ustawień. Zachowano 41 zdjęć, opisy, URL-e, kolejność, wyróżnienia i dotychczasowe reguły publikacji. Stare katalogi oraz archiwa pozostały w repozytorium.
- Kolekcja wyświetla tytuł, kategorię i status; edytor umożliwia zmianę danych projektu, okładki i galerii.
- Reader API z adapterem do istniejących typów; statyczne generowanie wszystkich detali.
- Niezależne root layouty CMS i strony publicznej. Header, footer i Tailwind nie przenikają do panelu.
- GitHub App przygotowane przez zmienne środowiskowe; lokalny zapis w produkcji jest zablokowany. Niekompletna konfiguracja zwraca 503.
- Optymalizacje pamięci opisane w [CMS-RESOURCES.md](CMS-RESOURCES.md).

## Wyniki

| Kontrola                            | Wynik                   |
| ----------------------------------- | ----------------------- |
| TypeScript                          | bez błędów              |
| ESLint                              | bez błędów i ostrzeżeń  |
| Prettier                            | poprawny format         |
| Produkcyjny build Next.js           | wszystkie 12 detali SSG |
| Testy Node                          | 12/12                   |
| Faktyczne handlery CMS GET/POST     | 9/9                     |
| Chrome/CDP — strona produkcyjna     | 85/85                   |
| Chrome/CDP — panel CMS              | 10/10                   |
| Porównanie publicznych screenshotów | 7/7 identycznych plików |

Test panelu faktycznie zmienił tytuł SEO, zapisał JSON przez API Keystatic i potwierdził zmianę na stronie. Następnie odtworzono oryginalny plik. Potwierdzono odczyt zdjęć w edytorze oraz brak wyjątków JavaScript. Wyniki są w [qa-cms](qa-cms/).

## Uruchomienie i produkcja

Lokalnie: `corepack pnpm dev`, następnie <http://localhost:3000/keystatic>.

To wdrożenie w kodzie projektu. Nie opublikowano zmian na Netlify ani nie utworzono GitHub App w koncie właściciela. Produkcyjna edycja wymaga jej konfiguracji oraz ustawienia sekretów i publicznych zmiennych opisanych w [CMS_README.md](../CMS_README.md). Potem należy wykonać build i deploy właściwej gałęzi. Zmiana treści przez GitHub również wymaga nowego buildu strony.
