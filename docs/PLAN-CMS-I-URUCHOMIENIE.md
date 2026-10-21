# Plan rozbudowy CMS i przygotowania strony do uruchomienia

Data: 21.10.2026. Status: plan, bez uruchamiania publikacji i indeksowania.

## Zakres

Punkty CMS 1–4 oznaczają: pełną edycję tekstów strony głównej, prawidłowe szkice, SEO projektów oraz przekierowania po zmianie adresów. Dodatkowy zakres: opisy 12 projektów, canonical i docelowa domena, sitemap oraz wysyłka kontaktu bez programu pocztowego.

Nie obejmuje przebudowy wyglądu, bloga, analityki ani pełnego podglądu szkiców na stronie. Istniejące logo i zdjęcie główne wymagają zamknięcia rozpoczętej weryfikacji.

## Zasady wykonania

- Zachować treści, zdjęcia, adresy projektów i obecną stylistykę.
- Zachować SSG, Next Image i Netlify Image CDN. CMS nie jest odpytywany przez publiczną stronę przy każdym wejściu.
- Wykorzystać istniejące pakiety, JSON i walidację; bez nowej bazy, procesu w tle lub dodatkowego dostawcy formularzy, jeśli Netlify Forms spełni wymagania.
- Budować i testować kolejno, na jednym serwerze testowym. Rozdzielić pliki wynikowe dev i build albo zatrzymywać dev przed buildem.
- Nie zmieniać automatycznie statusów projektów na opublikowane. Nie zdejmować blokad indeksowania w ramach tego planu.

## Etap 0 — zamknięcie bieżącej zmiany

1. Sprawdzić stan zmian logo i zdjęcia głównego oraz przywrócenie treści po testach.
2. Zakończyć test panelu i wyświetlania nowych obrazów, w tym lazy loading logo w stopce.
3. Potwierdzić czyszczenie procesów i plików testowych.

Odbiór: obecny wygląd pozostaje bez zmian przy pustych uploadach; nowe obrazy działają na telefonie i desktopie.

## Etap 1 — edycja treści strony głównej

1. Przenieść do pól singletonu nagłówek, wprowadzenie, podpisy sekcji, teksty przycisków, nagłówki części o pracowni, współpracy, opiniach, kontakcie i treści stopki.
2. Zachować obecne teksty jako dane startowe, włącznie z kontrolowanymi podziałami wierszy.
3. Oddzielić edytowalne treści od technicznych identyfikatorów sekcji i wewnętrznych linków, aby edycja tekstu nie psuła nawigacji.
4. Dodać walidację niepustych nagłówków i etykiet oraz poprawności edytowalnych linków.

Odbiór: uzgodnione teksty można zmienić bez edycji TSX; istniejący układ i odnośniki kotwicowe działają.

## Etap 2 — model publikacji i opisy projektów

1. Ustalić jedną funkcję wybierającą treści publiczne: wyłącznie `published`.
2. Zastosować ją w katalogu, wyróżnieniach, wyborze domyślnego hero, nawigacji, `generateStaticParams`, odczycie detalu i późniejszej sitemapie. Ukrycie w katalogu nie może pozostawiać publicznego detalu szkicu.
3. Zachować wszystkie wpisy w panelu, niezależnie od statusu. Dla projektu bez zatwierdzenia zachować szkic lub status do potwierdzenia.
4. Przygotować 12 propozycji opisów na podstawie istniejących obrazów i potwierdzonych danych: charakter projektu, widoczne rozwiązania, funkcja i potwierdzony zakres pracy.
5. Nie dopisywać nieznanych założeń inwestora, autorstwa, powierzchni, lokalizacji, dat ani informacji o realizacji. Pytania redakcyjne przechowywać poza publicznym opisem.
6. Uzyskać zatwierdzenie opisów, autorstwa i listy projektów przeznaczonych do publikacji przed przełączeniem produkcyjnej widoczności.

Zależność krytyczna: obecnie wszystkie 12 wpisów ma status inny niż `published`. Włączenie filtrowania bez przygotowania listy publikacji wyczyści publiczne portfolio. Kod można sprawdzić wcześniej na osobnych danych testowych.

Odbiór: publikacja projektu dodaje go do właściwych miejsc po deployu; wycofanie usuwa go z nich, a detal zwraca 404. Żaden projekt nie jest publikowany automatycznie w celu przejścia testów.

## Etap 3 — SEO, canonical i przekierowania

1. Dodać do projektu opcjonalny tytuł SEO, opis SEO i obraz udostępniania z opisem alternatywnym. Zachować fallback do tytułu, opisu i okładki projektu.
2. Ustalić adres produkcyjny `https://cywinska-studio.pl` w jednym module konfiguracji. Oddzielić go od adresu podglądu Netlify.
3. Generować canonical dla każdej publicznej strony, z właściwą ścieżką; detale nie mogą wskazywać canonical na stronę główną.
4. Sprawdzić ustawienia domeny głównej w Netlify, HTTPS i przekierowania wariantów `www` oraz HTTP. Zmiany hosta ograniczyć do domen tej strony, aby nie przekierowywać środowisk podglądu.
5. Zinwentaryzować dawne adresy na podstawie starej strony, archiwum i dostępnych danych właściciela. Nie zakładać, że lista w repozytorium jest pełna.
6. Dodać edytowalny w CMS rejestr stary adres → nowy adres oraz instrukcję dodania wpisu przy zmianie sluga. Sama zmiana sluga w Keystatic nie gwarantuje automatycznego zapisania starego adresu.
7. Walidować duplikaty, pętle, łańcuchy przekierowań, nieistniejące cele i kolizje z aktywnymi trasami. Wygenerować trwałe przekierowania 301/308 przy buildzie, bez osobnej funkcji serwerowej.

Odbiór: właściwe metadane w HTML; canonical używa docelowej domeny; stare adresy prowadzą jednym przekierowaniem do działających, opublikowanych stron.

## Etap 4 — mapa strony i przygotowanie indeksowania

1. Dodać `app/sitemap.ts` z bezwzględnymi adresami strony głównej, katalogu i opublikowanych projektów; pozostałe strony uwzględnić według przyjętej polityki indeksowania.
2. Wykluczyć CMS, API, plik definicji formularza, szkice, stare przekierowane adresy i środowiska podglądu.
3. Podawać `lastModified` tylko z wiarygodnych danych o zmianie treści, nie z daty każdego buildu.
4. Uporządkować reguły robots i nagłówki w Next.js oraz Netlify, aby późniejsze odblokowanie produkcji nie pozostawiło sprzecznych dyrektyw.
5. Zachować domyślne blokady do osobnego uruchomienia indeksowania po odbiorze treści i testów.

Odbiór: `/sitemap.xml` jest poprawny, zgodny z canonical i zawiera wyłącznie docelowe adresy; każdy wymieniony adres zwraca 200.

## Etap 5 — kontakt przez Netlify Forms

1. Zweryfikować dostępność i limity Forms w obecnym projekcie Netlify oraz ustalić odbiorcę powiadomień.
2. Wykorzystać istniejący `public/__forms.html` i nazwę `kontakt-pracownia`; włączyć wykrywanie formularzy oraz wykonać deploy.
3. Podłączyć formularz React przez AJAX: POST URL-encoded do `/__forms.html`, z zgodnymi nazwami pól i `form-name`. Nie wysyłać JSON ani POST do `/`, który może przechwycić adapter Next.js.
4. Zachować walidację pól, dodać honeypot, blokadę wielokrotnego kliknięcia, timeout oraz dostępne komunikaty powodzenia i błędu. Pozostawić dane w polach po błędzie.
5. Komunikat sukcesu ma oznaczać przyjęcie zgłoszenia przez usługę, nie gwarancję dostarczenia e-maila ani przeczytania go. Osobno zweryfikować zapis w Forms i powiadomienie w skrzynce.
6. Zachować bezpośredni adres e-mail i telefon jako alternatywę. Uporządkować nieużywany adapter/API i dawną ścieżkę przygotowywania wiadomości, aby pozostał jeden aktywny mechanizm wysyłki formularza.
7. Zaktualizować treści prywatności i komunikaty formularza do rzeczywistego przetwarzania danych przez Netlify; konfigurację odbiorców przechowywać poza publicznym CMS.

Odbiór: test na wdrożeniu Netlify potwierdza zgłoszenie w panelu Forms i odbiór powiadomienia; testy błędu i braku sieci nie pokazują fałszywego sukcesu. Sprawdzić również folder Spam w Forms. Zwykły `next dev` nie zastępuje testu integracji Netlify.

## Etap 6 — testy i wdrożenie

1. Oddzielić historyczny test bezstratnej migracji od testów aktualnej treści, aby prawidłowa edycja CMS nie powodowała błędów porównania z archiwum.
2. Dodać testy publikacji, 404 szkiców, metadanych, canonical, sitemap oraz przekierowań.
3. Sprawdzić formularz: walidację, stany wysyłania, błędy HTTP/sieci, ponowną próbę i poprawny komunikat przyjęcia.
4. Uruchomić kolejno TypeScript, lint, format, testy Node, build oraz Chrome/CDP; uwzględnić telefon, klawiaturę i brak regresji galerii.
5. Wdrożyć najpierw do podglądu Netlify. Sprawdzić finalne nagłówki i przekierowania na hostingu, nie tylko w kodzie.
6. Po odbiorze wdrożyć produkcję z zatwierdzonymi projektami, zachowując blokady indeksowania do osobnej decyzji o uruchomieniu.

## Dane potrzebne od właściciela

- Lista projektów dopuszczonych do publikacji i potwierdzony zakres autorstwa.
- Uzupełnienia faktów potrzebnych do opisów projektów; akceptacja przygotowanych propozycji.
- Dawne adresy strony/projektów, jeśli nie da się ich odtworzyć z repozytorium i publicznego archiwum.
- Docelowy odbiorca powiadomień kontaktowych i potwierdzenie działania skrzynki.

## Źródła

- Netlify Forms: https://docs.netlify.com/manage/forms/setup/
- Google canonical: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

Przy planowaniu formularza wykorzystano umiejętność netlify:netlify-forms. Plan nie włącza usług ani nie wysyła wiadomości.
