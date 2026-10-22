# Release CMS — 22.10.2026

Status: wdrożony i sprawdzony na produkcji. Indeksowanie pozostaje wyłączone.

- Strona: <https://cywinska-studio.pl>
- CMS: <https://cywinska-studio.pl/keystatic>
- PR: <https://github.com/proias/studio_archtektury/pull/1>
- Commit aplikacji: `f86b6e78cbe75af87fe47e6f682c12b7de6dcd0e`.
- Produkcyjny deploy Netlify: `6ad972e079ec8a3d035c995a`, stan `ready`, kontekst `production`, zgodny commit.

## Zakres

Zaimplementowano edycję tekstów strony i katalogu, logo i niezależnego hero, publikację i szkice, SEO projektów, canonical, sitemapę oraz walidowany rejestr przekierowań. Formularz korzysta z Netlify Forms i ma komunikaty błędów, zachowanie danych przy błędzie, blokadę wielokrotnego wysyłania oraz honeypot.

Projekt `dom-lodzkie-3` jest jedynym opublikowanym wpisem. Zachowano ostatnie uploady i dane właściciela. Wszystkie 12 projektów pozostaje w CMS; opisy są tymczasowe i wymagają zatwierdzenia redakcyjnego. Publiczny detal informuje o tymczasowym opisie. Pozostałe 11 detali zwraca 404.

## Weryfikacja

- TypeScript, ESLint i Prettier: poprawne, również na runnerze GitHub.
- Testy Node: 14/14; integracja API Keystatic: 9/9.
- Test przeglądarkowy panelu CMS, zapisu i obrazów: poprawny w [GitHub Actions](https://github.com/proias/studio_archtektury/actions/runs/39648274999).
- Produkcyjny build Netlify oraz kontrole nagłówków i przekierowań: poprawne.
- Chrome/CDP: 67/67 na podglądzie oraz 67/67 na produkcji; responsywność, nawigacja, obrazy, galeria, focus, publikacja, 404, stany formularza, canonical i blokada indeksowania.
- HTTP oraz `www` przekierowują 301 na `https://cywinska-studio.pl/`.
- Produkcyjna sitemap zawiera tylko stronę główną, katalog i zatwierdzony projekt. Panel, API oraz szkice są pominięte.
- Rzeczywisty, pojedynczy POST formularza otrzymał HTTP 200. Zgłoszenie `CMS-RELEASE-2026-10-22-f86b6e7` potwierdzono w Netlify Forms, ID `6ad9737c6d6ebc07aaef8b6d`. Nie jest zapytaniem klienta.
- Nagłówki `noindex` i `robots.txt` nadal blokują indeksowanie.

## Zasoby

Publiczna treść jest generowana podczas buildu. Nie dodano bazy danych ani procesu w tle. Karty otrzymują tylko potrzebne pola. Odczyt wymiarów obrazów jest kolejkowany i pamiętany; szkice nie uruchamiają odczytu galerii publicznej. Pomiar dla bieżącej publikacji: cztery unikalne obrazy, maksymalnie jeden równoległy odczyt natywny, szczyt procesu około 76 MiB.

Build wykonano na Netlify, a ciężki test panelu na runnerze GitHub. Lokalnie uruchamiano tylko Chrome przeciw gotowemu wdrożeniu. Testy Node są wykonywane kolejno; dev i build mają osobne katalogi wynikowe.

## Pozostałe decyzje właściciela

- Powiadomienia e-mail Netlify Forms właściciel skonfiguruje później. Zapis zgłoszeń działa; dostarczenie powiadomienia do skrzynki nie było testowane.
- Zastąpić tymczasowe opisy zatwierdzonymi treściami i świadomie opublikować kolejne projekty.
- Uzupełnić historyczne przekierowania dopiero po ustaleniu rzeczywistych dawnych adresów; rejestr pozostaje pusty. Zobacz [audyt](REDIRECT-AUDIT.md).
- Włączenie indeksowania wymaga osobnej decyzji i ustawienia `SITE_INDEXING_ENABLED=true` dla produkcji po zatwierdzeniu treści.

Instrukcja obsługi i konfiguracji: [CMS_README.md](../CMS_README.md).
