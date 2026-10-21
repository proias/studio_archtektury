# Audyt dawnych adresów

Repozytorium zawiera archiwalne dane trzech wcześniejszych projektów (`docs/legacy-projects.json`) oraz kontrakt portfolio przed CMS. Stare dane zawierają identyfikatory, nazwy i adresy obrazów, ale nie stanowią wiarygodnej listy dawnych podstron.

Nie utożsamiamy automatycznie starych identyfikatorów z obecnymi projektami. W archiwum są również niespójne informacje o typie projektu i autorstwie. Nie wygenerowano fikcyjnych przekierowań do przypadkowych realizacji.

Rejestr `content/redirects.json` jest początkowo pusty i dostępny w CMS jako „Przekierowania starych adresów”. Wpis zawiera lokalne ścieżki `source` i `destination`. Cel musi być istniejącą opublikowaną stroną. Build odrzuca duplikaty, pętle, łańcuchy, zastępowanie aktywnych stron oraz tras panelu, API i Next.js.

Przy każdej zmianie sluga dodaj dotychczasowy adres do rejestru. Keystatic nie zapisuje automatycznie historii adresu w tym modelu.

Do uzupełnienia po otrzymaniu potwierdzonej listy: stare adresy z Search Console, wcześniejszej mapy strony lub eksportu poprzedniej witryny. Zmienione przez CMS adresy obrazów pierwszego projektu pobrano z GitHuba i zachowano.

Docelowy host: `https://cywinska-studio.pl`. Przed releasem potwierdzono odpowiedź 200 HTTPS oraz przekierowania 301 z HTTP i `www` do domeny głównej. Next.js dodatkowo zawiera regułę hosta dla `www`.
