# CMS: redakcja i zatwierdzanie zmian

Status: wdrożono 22.10.2026. Wyniki: [raport odbioru](RELEASE-CMS-CLOUD-2026-10-22.md).

## Plan wdrożenia

1. Rozszerzyć autorstwo o własne, współautorstwo i materiały zewnętrzne ze zgodą. Zachować dotychczasowe wartości oraz domyślne „Do potwierdzenia”; nie zmieniać statusów projektów.
2. Dodać obsługę storage Cloud przez jawny identyfikator `zespół/projekt`. Zachować tryb GitHub do czasu skonfigurowania i przetestowania konta Cloud. Pliki obrazów i Netlify Image CDN pozostają bez zmian.
3. Wskazać `cms/` jako prefiks gałęzi redakcyjnych. Sam prefiks nie jest kontrolą bezpieczeństwa. Ochrona `main` ma wymagać PR i zatwierdzenia właściciela.
4. Po zapisie na `cms/**` utworzyć lub znaleźć istniejący PR do `main`, poprosić właściciela o review. Nie scalać automatycznie. Jeden PR zbiera zmiany wielu dokumentów.
5. Włączyć wspierane przez Keystatic `previewUrl`. Przycisk Preview prowadzi do strony pokazującej PR oraz gotowy Deploy Preview dla jego aktualnego commitu. Podczas buildu nie pokazywać starego deployu jako aktualnego. Nie przechwytywać Save, tokenów ani wewnętrznego DOM Keystatic.
6. Zweryfikować typy, format, lint, odczyt nowych wartości, statusy PR i podglądu oraz build Netlify. Sprawdzić gałąź testową bez zmiany produkcyjnej treści. Po publikacji włączyć ochronę `main`.

## Warunki po stronie kont

- Właściciel tworzy projekt w Keystatic Cloud, łączy `proias/studio_archtektury`, podaje identyfikator i zatwierdza dozwoloną domenę CMS. Dopiero wtedy zmieniamy storage na Cloud.
- Dostęp redaktorów Cloud jest na poziomie zespołu. Osobny zespół dla tej strony zapobiega udostępnianiu innych projektów.
- GitHub Actions musi mieć pozwolenie na tworzenie Pull Requests. Workflow ma tylko odczyt repozytorium i zapis PR.
- Prośba o review nie gwarantuje e-maila: właściciel włącza e-mail dla żądanych recenzji w swoich ustawieniach GitHub Notifications.
- Netlify: produkcyjna gałąź `main`, Deploy Previews włączone, branch deploye wyłączone, aby nie budować podwójnie tych samych zmian.
- Każdy zapis do otwartego PR może uruchomić nowy build preview. Produkcja buduje się dopiero po merge. Nie jest to podgląd na żywo bez buildu.

## Zakończenie sesji redakcyjnej

W CMS utwórz nową gałąź `cms/...` z aktualnego `main`. Zapisuj na niej wszystkie dokumenty należące do jednej publikacji. Otwórz Preview, poczekaj na gotowy build i sprawdź stronę. Właściciel zatwierdza PR i wykonuje Squash and merge. Następną sesję rozpocznij od nowej gałęzi z aktualnego `main`, nie od starej scalonej gałęzi.

Szkice są nadal ukryte także w Deploy Preview. Aby obejrzeć projekt w tym przepływie, ustaw „Opublikowany” na gałęzi roboczej. Produkcja zachowuje stan z `main` do merge. Podglądy pozostają noindex; publiczny link preview nie jest ochroną poufnych materiałów.
