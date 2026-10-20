# Konfiguracje przed publikacją

## Hosting i indeksacja

Tryb roboczy jest lokalnym serwerem Next.js. Produkcyjny hosting nie został potwierdzony i nie został zmieniony. Opcja images.unoptimized pozostaje włączona, ponieważ strona dostarcza gotowe WebP i nie zakłada usługi optymalizacji na hostingu. Po ustaleniu serwera Next można włączyć optymalizację i warianty rozdzielczości; eksport statyczny wymaga usunięcia/zmiany trasy API i nagłówków serwerowych.

Wersja robocza ma robots noindex/nofollow w metadanych, X-Robots-Tag oraz robots.txt Disallow: /. Nie ma produkcyjnego canonical ani mapy strony. Przed publikacją ustawić zatwierdzoną domenę, metadataBase, canonical i mapę strony obejmującą wyłącznie zatwierdzone projekty. Samo noindex nie zapewnia kontroli dostępu: ewentualny zewnętrzny podgląd wymaga prywatnego hostingu.

## Kontakt

Dostępne są działające tel:, mailto: i link do map. Formularz waliduje dane wspólnym schematem Zod, przygotowuje wiadomość i otwiera program pocztowy. Nie potwierdza dostarczenia. Przycisk nie jest podpisany „Wyślij”. Dane formularza nie trafiają automatycznie do serwera.

POST /api/contact waliduje dane i zwraca 400 dla błędnych pól, 415 dla niewłaściwego typu, 413 dla nadmiernego rozmiaru i 503 przy braku dostawcy. lib/contact-adapter.ts określa kontrakt usługi; nie ma kluczy ani aktywnej integracji. Aby włączyć wysyłkę: wybrać usługę zgodną z hostingiem, umieścić sekrety po stronie serwera, dodać adapter, ochronę przed nadużyciami i podłączyć UI. Następnie przetestować awarię, faktyczne dostarczenie na skrzynkę i zatwierdzić informacje o przetwarzaniu danych. Automatyczne testy tej wersji nie wysyłają prawdziwych zapytań. Wysyłka pozostaje otwartym punktem odbioru.

## CMS — osobny wymagany etap

Pliki lib/projects.ts i lib/site-content.ts rozdzielają dane od widoków; nie są panelem administracyjnym. Nie utworzono publicznego edytora ani pozornego CMS w localStorage.

CMS powinien mieć logowanie, role właścicielki i ewentualnego redaktora, autoryzację po stronie serwera, historię zmian i oddzielny podgląd roboczy. Model Project powinien odwzorowywać obecne slug, title, category, location, year, description, cover, images, credits, publicationStatus i featuredOrder. Edytowalne muszą być też alt, kolejność i proporcje obrazów oraz pola SEO. Osobny dokument SiteSettings obejmie kontakt, dane firmy, sekcje strony i domyślne SEO.

Po wyborze hostingu ustalić dostawcę CMS, miejsce przechowywania oryginałów i wariantów zdjęć, sposób autoryzacji, tworzenia prywatnych podglądów i publikowania (webhook/revalidate dla serwera Next albo ponowny build dla eksportu statycznego). Pole publicationStatus musi blokować niezatwierdzony materiał w publicznym zapytaniu; obecny model pokazuje siedem roboczych projektów wyłącznie w lokalnej wersji, a dom-kostka nie ma linku w portfolio. Wdrożyć eksport/backup i test przekazania właścicielce bez pracy w kodzie. Panel pozostaje wymaganym etapem przed pełnym przekazaniem.

## Opinie Google

Dostępny jest tylko odnośnik do wizytówki, bez fikcyjnych opinii i bez statycznego licznika ocen. lib/google-reviews-adapter.ts jest niepodłączonym kontraktem. Automatyczne pobieranie wymaga wyboru usługi i sprawdzenia aktualnych oficjalnych zasad Google, uprawnień, oznaczeń, przechowywania i aktualizacji danych. Przy awarii zawsze pozostaje link do wizytówki.

## Materiały i Paulina

Wszystkie osiem rekordów ma niepotwierdzone autorstwo i status roboczy. Nowe projekty nie dostały wymyślonych lat ani lokalizacji. Dane SPA (Łódź, 2025) i domu DOM 2 (Łódź, 2024) zachowano z dotychczasowego repozytorium. Sporny dom typu kostka ma pending-confirmation i jest dostępny do oceny wyłącznie po bezpośrednim lokalnym adresie /projekty/dom-kostka. Nie ma go w głównej siatce ani w planowanej mapie publikacji.

Pełna nierozstrzygnięta lista: DO-POTWIERDZENIA-Z-PAULINA.md. Obejmuje autorstwo i zgody, powiązania z PDF i innymi pracowniami, nazwy/lata/statusy, zakres usług, doświadczenie, portret, logo, hosting, CMS, dostarczanie formularza, Google, prywatność i dane rejestrowe. Lista pozostaje otwarta.

