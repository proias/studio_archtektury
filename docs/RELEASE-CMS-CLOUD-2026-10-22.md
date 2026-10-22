# CMS Cloud i redakcja — odbiór 22.10.2026

## Wdrożenie

- Cloud: `architektura/cywinska-studio`, połączony z projektem strony. Właściciel potwierdził działające logowanie i widoczność projektów na produkcji.
- Aplikacja: [PR #2](https://github.com/proias/studio_archtektury/pull/2), commit `a3b4a07cad847c70ce819ecac8bec0ffa263477a`; pierwszy deploy produkcyjny `6ad9bc7895caafa7210c2672`.
- Poprawka kontroli treści dla PR bota: commit `00255591a7877d2a9d388fd024f04941c056da6c`.
- Poprawka opóźnionych metadanych po Save: [PR #4](https://github.com/proias/studio_archtektury/pull/4), commit `f01a220a5431cd757ff85ed61c7cefdd51783f6e`.
- Indeksowanie pozostaje wyłączone. Nie zmieniono treści ani uploadów właściciela w ramach tego wdrożenia.

## Zachowanie

Autorstwo ma cztery opcje: do potwierdzenia, własne, współautorstwo i materiały zewnętrzne ze zgodą. Domyślne wartości zachowano; żadnego projektu nie zatwierdzono automatycznie.

Na gałęzi `cms/...` pierwszy zapis tworzy PR i prośbę o review `proias`; kolejne zapisy aktualizują ten sam PR. Wbudowany przycisk Preview w edytorze otwiera stan zapisanych zmian. Gotowy link wymaga poprawnego statusu Netlify dla bieżącej gałęzi i zgodnego commitu PR. Podczas propagacji metadanych, buildu, błędu oraz po zamknięciu PR link nie jest prezentowany jako aktualny podgląd. Nie dodano przechwytywania Save, tokenów użytkownika ani modyfikacji biblioteki.

`main` wymaga PR, aktualnej bazy, jednej recenzji CODEOWNERS i dwóch kontroli: `CMS content boundary` oraz `netlify/cywinska-studio/deploy-preview`. Kontrole przypisane są do aplikacji GitHub Actions i Netlify. Nowe zapisy unieważniają review. Właściciel-admin zachowuje jawnie zaakceptowany wyjątek techniczny. Force-push i usuwanie main są zablokowane. Repozytorium dopuszcza tylko ręczny Squash and merge, bez auto-merge, z usuwaniem gałęzi po scaleniu.

## Weryfikacja

- TypeScript, ESLint, formatowanie, integracja API CMS i testy panelu przeszły w CI.
- Lokalnie sprawdzono testami odczyt nowych wartości autorstwa, stany Preview, opóźnione metadane PR i rzeczywisty kod workflow uruchamiany w izolacji.
- Zdalny Chrome sprawdził publiczną stronę, responsywność strony statusu, izolację CSS oraz ekran logowania Cloud. Nie uruchamiano lokalnego Next razem z Chrome; lokalny test zatrzymany przez ochronę RAM nie jest liczony jako zaliczony.
- [Testowy PR #3](https://github.com/proias/studio_archtektury/pull/3) został utworzony przez `github-actions[bot]`, z prośbą o review `proias`. Dwa zapisy — projekt i strona główna — dały dwa commity i dwa pliki w tym samym PR.
- Netlify Preview #3 zawierał znacznik testowy strony głównej, podczas gdy produkcja go nie zawierała. Produkcyjny endpoint CMS zwrócił właściwy URL Preview i SHA gałęzi. Kontrola treści przeszła także po automatycznym PR bota.
- PR testowy zamknięto bez merge, gałąź testową usunięto. CMS poprawnie pokazał stan zamknięty bez linku gotowego podglądu. Żadna testowa treść nie została opublikowana.
- Git branch deploye są pomijane przez konfigurację `ignore` przed pełnym buildem; PR nadal uruchamia Deploy Preview. Nie dodano bazy, serwisu e-mail ani nowej zależności runtime.

## Obsługa

W CMS zawsze zaczynaj sesję od nowej gałęzi `cms/nazwa-zmiany` utworzonej z aktualnego `main`. Po zapisach kliknij Preview. Zatwierdzenie i Squash and merge wykonuje właściciel w GitHub. Po merge rozpocznij kolejną sesję od nowej gałęzi.

Redaktora zaprasza właściciel do zespołu Cloud tej strony; nie podano konta do zaproszenia. Nie potrzebuje on uprawnień GitHub ani Netlify. Cloud nie zapewnia tu osobnych ról dla każdej kolekcji.

Prośba o review została zweryfikowana w GitHub. Dostarczenie e-maila zależy od ustawień powiadomień i skrzynki właściciela; w [GitHub Notifications](https://github.com/settings/notifications) należy włączyć e-mail dla uczestnictwa i żądań review. Nie deklarujemy odebrania wiadomości bez potwierdzenia właściciela.

Plan: [PLAN-CMS-REDAKCJA.md](PLAN-CMS-REDAKCJA.md). Instrukcja: [CMS_README.md](../CMS_README.md).
