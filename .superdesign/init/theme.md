Next.js 15, React 18, custom CSS, Radix dialogs. Existing palette warm white #f7f7f5, charcoal #292a27; Montserrat display, PT Sans body. Sharp corners, 768/900/1024 breakpoints.
## app/globals.css
```
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
:root {
  --background: #f7f7f5;
  --foreground: #292a27;
  --card: #fff;
  --card-foreground: #292a27;
  --popover: #fff;
  --popover-foreground: #292a27;
  --primary: #292a27;
  --primary-foreground: #f7f7f5;
  --secondary: #eeefea;
  --secondary-foreground: #292a27;
  --muted: #eeefea;
  --muted-foreground: #6f726c;
  --accent: #e3e4df;
  --accent-foreground: #292a27;
  --destructive: #ad2929;
  --border: #e3e4df;
  --input: #e3e4df;
  --ring: #5d605b;
  --radius: 0rem;
  --text: #5d605b;
  --dark-background: #222420;
  --dark-foreground: #f2f1ec;
  --dark-muted: #c7c9c0;
  --dark-hint: #b4b7ac;
  --footer-background: #141512;
}
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --font-sans: var(--font-pt-sans), Arial, sans-serif;
  --font-heading: var(--font-montserrat), Arial, sans-serif;
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
  --radius-xl: 0;
}
* {
  box-sizing: border-box;
  border-color: var(--border);
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 100px;
}
body {
  margin: 0;
  background: var(--background);
  color: var(--text);
  font-family: var(--font-pt-sans), Arial, sans-serif;
  font-size: 17px;
  line-height: 1.65;
}
h1,
h2,
h3,
h4 {
  font-family: var(--font-montserrat), Arial, sans-serif;
  color: var(--foreground);
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
}
h1 {
  font-size: 48px;
  letter-spacing: -0.035em;
}
h2 {
  font-size: 36px;
  letter-spacing: -0.025em;
}
h3 {
  font-size: 19px;
}
p {
  margin: 0 0 20px;
}
a {
  color: inherit;
  text-decoration: none;
}
button,
input,
select,
textarea {
  font: inherit;
}
button {
  cursor: pointer;
}
button:disabled {
  cursor: wait;
  opacity: 0.65;
}
img {
  display: block;
  max-width: 100%;
}
button,
a,
input,
select,
textarea {
  -webkit-tap-highlight-color: transparent;
}
:focus-visible {
  outline: 2px solid var(--text);
  outline-offset: 5px;
}
.dark-section :focus-visible,
.site-footer :focus-visible,
.lightbox :focus-visible {
  outline-color: var(--dark-foreground);
}
::selection {
  background: #dadbd3;
  color: var(--dark-background);
}
.container {
  width: min(100% - 128px, 1280px);
  margin-inline: auto;
}
.section {
  padding-block: 104px;
}
[id] {
  scroll-margin-top: 100px;
}
.eyebrow {
  font-family: var(--font-montserrat), Arial, sans-serif;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 24px;
  color: var(--muted-foreground);
}
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-height: 44px;
  border-bottom: 1px solid #a6a89e;
  font-size: 15px;
  color: var(--foreground);
}
.text-link:hover {
  border-bottom-color: currentColor;
}
.site-header {
  height: 76px;
  position: sticky;
  top: 0;
  background: var(--background);
  z-index: 30;
  border-bottom: 1px solid var(--border);
}
.header-inner {
  height: 100%;
  width: min(100% - 128px, 1280px);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.wordmark {
  min-height: 44px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-family: var(--font-montserrat), Arial, sans-serif;
  color: var(--foreground);
  line-height: 1.4;
  white-space: nowrap;
}
.wordmark span {
  font-size: 16px;
  letter-spacing: 0.12em;
  font-weight: 500;
}
.wordmark small {
  font-size: 10px;
  letter-spacing: 0.22em;
}
.wordmark-logo {
  width: clamp(150px, 45vw, 240px);
  height: 56px;
  object-fit: contain;
  object-position: left center;
}
.desktop-nav {
  display: flex;
  gap: 36px;
}
.desktop-nav a {
  font-family: var(--font-montserrat), Arial, sans-serif;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  min-height: 44px;
  display: flex;
  align-items: center;
}
.desktop-nav a:hover {
  text-decoration: underline;
  text-underline-offset: 7px;
}
.menu-toggle {
  display: none;
  background: none;
  border: 0;
  color: var(--foreground);
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
}
.hero {
  max-width: 1280px;
  margin: auto;
  background: var(--border);
}
.hero img {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  max-height: 720px;
  object-fit: contain;
}
.intro {
  padding-block: 72px 88px;
}
.intro-columns {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 80px;
  align-items: start;
}
.intro-columns > div {
  max-width: 420px;
  padding-top: 5px;
}
.intro-columns p {
  font-size: 18px;
}
.intro .text-link {
  margin-top: 10px;
}
.portfolio-section {
  background: #fff;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin-bottom: 48px;
}
.section-heading .eyebrow {
  margin-bottom: 14px;
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 48px 28px;
}
.project-card {
  display: block;
  min-width: 0;
}
.project-cover {
  position: relative;
  aspect-ratio: 3/2;
  background: var(--muted);
  overflow: hidden;
}
.project-cover img {
  object-fit: cover;
}
.project-caption {
  padding-top: 20px;
  display: grid;
  grid-template-columns: 1fr 18px;
  gap: 9px 12px;
}
.project-caption h3 {
  font-size: 17px;
  line-height: 1.5;
}
.project-caption > svg {
  margin-top: 4px;
  color: var(--muted-foreground);
}
.project-caption p {
  grid-column: 1/-1;
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
}
.project-card:hover h3 {
  text-decoration: underline;
  text-underline-offset: 5px;
}
.dark-section {
  background: var(--dark-background);
  color: var(--dark-muted);
}
.dark-section h2,
.dark-section h3,
.dark-section .text-link {
  color: var(--dark-foreground);
}
.dark-section .eyebrow {
  color: var(--dark-hint);
}
.about-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
}
.about-lead {
  font-size: 23px;
  margin-top: 28px;
  color: var(--dark-muted);
  line-height: 1.5;
}
.about-copy {
  padding-top: 40px;
}
.about-copy p:last-child {
  margin-bottom: 0;
}
.process-columns {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 100px;
}
.process-intro {
  margin-top: 30px;
}
.process-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.process-list li {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 20px;
  border-top: 1px solid var(--border);
  padding: 25px 0;
}
.process-list li:last-child {
  border-bottom: 1px solid var(--border);
}
.step-number {
  font-family: var(--font-montserrat), Arial, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
  padding-top: 4px;
}
.process-list h3 {
  font-size: 19px;
  margin-bottom: 10px;
}
.process-list p {
  margin: 0;
  font-size: 16px;
}
.reviews-section {
  border-top: 1px solid var(--border);
  background: #fff;
}
.reviews-inner {
  padding-block: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}
.reviews-inner p {
  margin: 0;
}
.contact-columns {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 100px;
}
.contact-intro {
  max-width: 380px;
  margin-top: 28px;
}
address {
  font-style: normal;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 35px;
}
address a:not(.text-link) {
  color: var(--dark-foreground);
}
address p {
  margin: 7px 0 0;
  max-width: 250px;
}
.contact-email {
  font-size: 21px;
  overflow-wrap: anywhere;
}
.service-area {
  font-size: 14px;
  max-width: 360px;
  margin-top: 40px;
}
.service-area span {
  display: block;
  color: var(--dark-foreground);
  margin-bottom: 6px;
}
.contact-form-wrap > h3 {
  margin-bottom: 16px;
  font-size: 22px;
}
.form-note {
  font-size: 14px;
  color: var(--dark-hint);
  line-height: 1.6;
}
.contact-form-wrap form {
  display: grid;
  gap: 24px;
  margin-top: 26px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--dark-foreground);
}
label span {
  color: var(--dark-hint);
}
input,
select,
textarea {
  width: 100%;
  border: 0;
  border-bottom: 1px solid #71766a;
  border-radius: 0;
  background: transparent;
  padding: 9px 0;
  color: var(--dark-foreground);
  min-height: 44px;
  outline-offset: 5px;
}
textarea {
  resize: vertical;
  min-height: 120px;
}
textarea::placeholder {
  color: var(--dark-hint);
}
select {
  color-scheme: dark;
}
option {
  background: var(--dark-background);
  color: var(--dark-foreground);
}
[aria-invalid="true"] {
  border-color: #f4ada5;
}
.field-error {
  font-size: 14px;
  line-height: 1.4;
  color: #f4ada5;
  margin: 8px 0 0;
}
.contact-submit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  background: var(--dark-foreground);
  color: var(--foreground);
  border: 1px solid var(--dark-foreground);
  padding: 15px 20px;
  width: 100%;
  font-size: 15px;
  min-height: 54px;
}
.contact-submit:hover {
  background: var(--border);
}
.form-note:last-of-type {
  margin: 0;
}
.form-status {
  margin: 0;
  color: var(--dark-foreground);
  font-size: 15px;
}
.form-status:empty {
  display: none;
}
.site-footer {
  background: var(--footer-background);
  color: #a9ada1;
  padding-top: 48px;
}
.site-footer .wordmark,
.site-footer .text-link {
  color: var(--dark-foreground);
}
.footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  padding-bottom: 40px;
}
.footer-top p {
  margin: 0;
  font-size: 15px;
}
.footer-bottom {
  border-top: 1px solid #34362f;
  padding-block: 25px;
  display: flex;
  gap: 35px;
  justify-content: space-between;
  font-size: 13px;
}
.footer-bottom a {
  text-decoration: underline;
  text-underline-offset: 4px;
}
.filters {
  display: flex;
  gap: 12px 24px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}
.filters button {
  background: none;
  border: 0;
  border-bottom: 1px solid transparent;
  padding: 8px 0;
  min-height: 44px;
  color: var(--muted-foreground);
}
.filters button[aria-pressed="true"] {
  color: var(--foreground);
  border-color: var(--foreground);
}
.page-intro {
  margin-top: 24px;
  margin-bottom: 40px;
  max-width: 580px;
}
.projects-page {
  min-height: 65vh;
}
.project-page {
  padding-top: 48px;
}
.back-link {
  margin-bottom: 48px;
}
.project-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 64px;
  align-items: start;
}
.project-details {
  grid-column: 2;
  grid-row: 1;
  position: sticky;
  top: 125px;
}
.project-details h1 {
  font-size: 34px;
  line-height: 1.35;
  margin-bottom: 28px;
}
.project-details > p {
  margin-bottom: 32px;
}
.project-details dl {
  border-top: 1px solid var(--border);
  margin-block: 36px;
}
.project-details dl > div {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  padding-block: 12px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.project-details dt {
  color: var(--muted-foreground);
}
.project-details dd {
  margin: 0;
  color: var(--foreground);
}
.project-gallery {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  gap: 28px;
  min-width: 0;
}
.gallery-image {
  background: var(--muted);
  border: 0;
  padding: 0;
  position: relative;
  display: block;
  width: 100%;
}
.gallery-image > img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
.zoom-icon {
  position: absolute;
  bottom: 15px;
  right: 15px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  background: var(--background);
  color: var(--foreground);
}
.next-project {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 28px;
  padding-block: 56px;
  margin-top: 48px;
  border-top: 1px solid var(--border);
}
.next-project span {
  font-size: 14px;
}
.next-project a {
  font-family: var(--font-montserrat), Arial, sans-serif;
  font-size: 22px;
  color: var(--foreground);
}
.menu-overlay,
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: #141512b8;
  z-index: 50;
}
.mobile-menu {
  position: fixed;
  inset: 0 0 0 auto;
  width: min(100%, 420px);
  background: var(--background);
  padding: 70px 32px 35px;
  z-index: 60;
  display: flex;
  flex-direction: column;
}
.mobile-menu nav {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 35px;
  font-family: var(--font-montserrat), Arial, sans-serif;
  font-size: 25px;
  color: var(--foreground);
}
.mobile-menu nav a {
  min-height: 44px;
}
.mobile-menu > p {
  margin-top: auto;
  padding-top: 40px;
  font-size: 14px;
}
.menu-close {
  position: absolute;
  right: 24px;
  top: 14px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  background: none;
  border: 0;
}
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: var(--footer-background);
  color: var(--dark-foreground);
  display: flex;
  flex-direction: column;
  padding: 65px 24px 20px;
}
.lightbox-photo {
  position: relative;
  flex: 1;
  min-height: 0;
}
.lightbox-photo img {
  object-fit: contain;
}
.lightbox-close {
  position: absolute;
  right: 18px;
  top: 10px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  background: none;
  border: 0;
}
.lightbox-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 35px;
  padding-top: 12px;
}
.lightbox-controls p {
  margin: 0;
  min-width: 50px;
  text-align: center;
}
.lightbox-controls button {
  display: grid;
  place-items: center;
  background: none;
  border: 1px solid var(--text);
  width: 44px;
  height: 44px;
}
.skip-link {
  position: fixed;
  top: 8px;
  left: 16px;
  transform: translateY(-180%);
  z-index: 100;
  background: var(--dark-foreground);
  color: var(--dark-background);
  padding: 8px 16px;
}
.skip-link:focus {
  transform: none;
}
.privacy-page {
  max-width: 850px;
  min-height: 65vh;
}
.privacy-page h1 {
  margin-bottom: 40px;
}
.privacy-page a {
  text-decoration: underline;
}
.not-found {
  min-height: 65vh;
}
.not-found h1 {
  margin-bottom: 24px;
}

@media (max-width: 1199px) {
  .container,
  .header-inner {
    width: calc(100% - 80px);
  }
  .desktop-nav {
    gap: 24px;
  }
  .intro-columns,
  .about-columns,
  .process-columns,
  .contact-columns {
    gap: 48px;
  }
  .project-layout {
    gap: 40px;
  }
  .contact-email {
    font-size: 19px;
  }
  .form-row {
    gap: 16px;
  }
}
@media (max-width: 1023px) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .section {
    padding-block: 80px;
  }
  h1 {
    font-size: 40px;
  }
  h2 {
    font-size: 32px;
  }
  .desktop-nav {
    gap: 20px;
  }
  .desktop-nav a {
    font-size: 11px;
  }
  .wordmark span {
    font-size: 14px;
  }
  .intro-columns {
    gap: 40px;
    grid-template-columns: 1fr 1fr;
  }
  .contact-columns {
    gap: 40px;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .project-layout {
    grid-template-columns: 1.6fr 1fr;
    gap: 32px;
  }
  .project-details h1 {
    font-size: 28px;
  }
  .footer-top {
    flex-wrap: wrap;
  }
  .footer-top p {
    display: none;
  }
}
@media (max-width: 899px) {
  .desktop-nav {
    display: none;
  }
  .menu-toggle {
    display: flex;
  }
  .about-columns,
  .process-columns,
  .contact-columns {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .about-copy {
    padding: 0;
    max-width: 620px;
  }
  .process-intro {
    max-width: 520px;
  }
  .contact-intro {
    max-width: 520px;
  }
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
  .contact-form-wrap {
    max-width: 650px;
  }
  .project-layout {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  .project-details {
    position: static;
    max-width: 620px;
  }
  .project-details h1 {
    font-size: 34px;
  }
  .project-gallery {
    width: 100%;
  }
  .project-details dl {
    margin-block: 24px;
  }
  .project-details > p {
    margin-bottom: 20px;
  }
}
@media (max-width: 767px) {
  .container,
  .header-inner {
    width: calc(100% - 48px);
  }
  .site-header {
    height: 68px;
  }
  .header-inner {
    gap: 12px;
  }
  .wordmark span {
    font-size: 13px;
    letter-spacing: 0.09em;
  }
  .wordmark small {
    font-size: 9px;
    letter-spacing: 0.17em;
  }
  .section {
    padding-block: 64px;
  }
  .hero img {
    aspect-ratio: 16/9;
    max-height: none;
    object-fit: contain;
  }
  .intro {
    padding-block: 48px 64px;
  }
  .intro .eyebrow {
    font-size: 10px;
    letter-spacing: 0.1em;
  }
  .intro-columns {
    grid-template-columns: 1fr;
    gap: 26px;
  }
  .desktop-break {
    display: none;
  }
  h1 {
    font-size: 34px;
  }
  h2 {
    font-size: 29px;
  }
  .intro-columns p {
    font-size: 17px;
  }
  .intro-columns > div {
    max-width: none;
  }
  .eyebrow {
    margin-bottom: 20px;
  }
  .section-heading {
    align-items: start;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 32px;
  }
  .section-heading .text-link {
    font-size: 14px;
  }
  .project-grid {
    grid-template-columns: 1fr;
    gap: 34px;
  }
  .project-caption {
    padding-top: 15px;
  }
  .project-caption h3 {
    font-size: 17px;
  }
  .about-columns,
  .process-columns,
  .contact-columns {
    gap: 32px;
  }
  .about-lead {
    font-size: 21px;
    margin-bottom: 0;
  }
  .about-copy p {
    font-size: 17px;
  }
  .process-list li {
    gap: 12px;
    grid-template-columns: 30px 1fr;
    padding-block: 22px;
  }
  .reviews-inner {
    padding-block: 28px;
    align-items: start;
    flex-direction: column;
    gap: 12px;
  }
  .reviews-inner p {
    max-width: 300px;
  }
  .contact-columns h2 {
    font-size: 30px;
  }
  .contact-form-wrap {
    border-top: 1px solid #53584c;
    padding-top: 36px;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 22px;
  }
  .contact-intro {
    margin-top: 24px;
  }
  .contact-email {
    font-size: 20px;
  }
  .service-area {
    margin-bottom: 0;
  }
  .footer-top {
    align-items: start;
    flex-direction: column;
    gap: 24px;
  }
  .footer-bottom {
    flex-wrap: wrap;
    justify-content: start;
    gap: 12px 25px;
  }
  .footer-bottom > span:first-child {
    width: 100%;
  }
  .project-page {
    padding-top: 28px;
  }
  .back-link {
    margin-bottom: 32px;
  }
  .project-details h1 {
    font-size: 32px;
  }
  .project-gallery {
    gap: 20px;
  }
  .next-project {
    margin-top: 32px;
    padding-block: 32px;
    align-items: start;
    flex-direction: column;
    gap: 12px;
  }
  .next-project a {
    font-size: 20px;
  }
  .filters {
    gap: 8px 20px;
    margin-bottom: 30px;
  }
  .filters button {
    font-size: 15px;
  }
  .lightbox {
    padding-inline: 12px;
  }
  .privacy-page h1 {
    font-size: 34px;
  }
  [id] {
    scroll-margin-top: 88px;
  }
  html {
    scroll-padding-top: 88px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}

```
## lib/appearance.ts
```
import content from "../content/appearance.json";

type Appearance = {
  logo: { title: string; subtitle: string; src: string | null; alt: string };
  hero: {
    src: string | null;
    alt: string;
    objectFit: "contain" | "cover";
    objectPosition: string;
  };
};

export const appearance: Appearance = content as Appearance;

```