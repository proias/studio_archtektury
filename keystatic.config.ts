import { collection, config, fields, singleton } from "@keystatic/core";
import { categories } from "./lib/projects";

// Only public configuration is used here: this module is also bundled for the admin UI.
const github = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "github";
const cloud = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "cloud";
const cloudProject = process.env.NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT;
if (cloud && !cloudProject?.match(/^[\w-]+\/[\w-]+$/)) {
  throw new Error("Set NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT to team/project.");
}
const preview = (pathname: string) =>
  github || cloud ? `/cms-preview?branch={branch}&path=${pathname}` : pathname;
const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;
if (github && !repo?.match(/^[\w.-]+\/[\w.-]+$/)) {
  throw new Error("Set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO to owner/repository.");
}
const text = (label: string) => fields.text({ label });
const required = (label: string) =>
  fields.text({ label, validation: { isRequired: true } });
const copyGroup = (label: string, labels: Record<string, string>) =>
  fields.object(
    Object.fromEntries(
      Object.entries(labels).map(([key, fieldLabel]) => [
        key,
        fields.text({
          label: fieldLabel,
          multiline: true,
          validation: { isRequired: true },
        }),
      ]),
    ),
    { label },
  );
const localPath = (label: string) =>
  fields.text({
    label,
    validation: {
      isRequired: true,
      pattern: {
        regex: /^\/(?!\/)[^?#\s]*$/,
        message:
          "Podaj ścieżkę zaczynającą się od /, bez domeny, parametrów i fragmentu.",
      },
    },
  });
const image = (label: string) =>
  fields.object({
    src: fields.image({
      label,
      directory: "public/images/projects",
      publicPath: "/images/projects/",
      validation: { isRequired: true },
    }),
    alt: required("Opis alternatywny"),
    // Historical dimensions are retained; the reader measures the actual file after uploads.
    width: fields.integer({ label: "Szerokość (automatycznie odczytywana)" }),
    height: fields.integer({ label: "Wysokość (automatycznie odczytywana)" }),
  });

export default config({
  storage: cloud
    ? { kind: "cloud", branchPrefix: "cms/" }
    : github
      ? {
          kind: "github",
          repo: repo as `${string}/${string}`,
          branchPrefix: "cms/",
        }
      : { kind: "local" },
  ...(cloud ? { cloud: { project: cloudProject! } } : {}),
  ui: { brand: { name: "Cywińska Studio — CMS" } },
  collections: {
    projects: collection({
      label: "Projekty",
      previewUrl: preview("/projekty/{slug}"),
      path: "content/projects/*",
      slugField: "title",
      columns: ["title", "category", "publicationStatus"],
      format: { data: "json" },
      schema: {
        title: fields.slug({
          name: { label: "Tytuł", validation: { isRequired: true } },
          slug: {
            label: "Adres projektu",
            validation: {
              pattern: {
                regex: /^[a-z0-9-]+$/,
                message:
                  "Użyj małych liter bez polskich znaków, cyfr i myślników.",
              },
            },
          },
        }),
        category: fields.select({
          label: "Kategoria",
          options: categories.map((value) => ({ label: value, value })),
          defaultValue: "Domy",
        }),
        location: text("Lokalizacja"),
        year: fields.integer({
          label: "Rok",
          validation: { min: 1900, max: 2200 },
        }),
        description: fields.text({ label: "Opis", multiline: true }),
        contentStatus: fields.select({
          label: "Status opisu",
          options: [
            { label: "Opis tymczasowy — do redakcji", value: "temporary" },
            { label: "Opis zatwierdzony", value: "approved" },
          ],
          defaultValue: "temporary",
        }),
        editorialNotes: fields.text({
          label: "Notatki redakcyjne (niepubliczne)",
          multiline: true,
        }),
        seo: fields.object(
          {
            title: text("Tytuł SEO (puste = tytuł projektu)"),
            description: fields.text({
              label: "Opis SEO (puste = opis projektu)",
              multiline: true,
            }),
            image: fields.image({
              label: "Obraz udostępniania (opcjonalnie)",
              directory: "public/images/site",
              publicPath: "/images/site/",
            }),
            imageAlt: text("Opis obrazu udostępniania"),
          },
          { label: "SEO i udostępnianie" },
        ),
        images: fields.array(image("Zdjęcie"), {
          label: "Galeria",
          itemLabel: (props) => props.fields.alt.value || "Zdjęcie",
          validation: { length: { min: 1 } },
        }),
        cover: fields.object(
          {
            ...image("Okładka").fields,
            objectPosition: fields.text({
              label: "Pozycja kadru",
              defaultValue: "50% 50%",
            }),
            objectFit: fields.select({
              label: "Kadrowanie",
              options: [
                { label: "Wypełnij", value: "cover" },
                { label: "Cały obraz", value: "contain" },
              ],
              defaultValue: "cover",
            }),
          },
          { label: "Okładka" },
        ),
        publicationStatus: fields.select({
          label: "Status",
          description:
            "Publicznie dostępne są tylko projekty opublikowane. Szkice i wpisy do potwierdzenia nie mają publicznej podstrony. Zmiana adresu wymaga wpisu w sekcji Przekierowania.",
          options: [
            { label: "Szkic (niepubliczny)", value: "draft" },
            { label: "Do potwierdzenia", value: "pending-confirmation" },
            { label: "Opublikowany", value: "published" },
          ],
          defaultValue: "draft",
        }),
        order: fields.integer({
          label: "Kolejność w katalogu",
          defaultValue: 100,
          validation: { isRequired: true, min: 1 },
        }),
        featuredOrder: fields.integer({
          label: "Kolejność na stronie głównej (puste = bez wyróżnienia)",
          validation: { min: 1 },
        }),
        sourceFolder: text("Folder źródłowy (archiwum)"),
        credits: fields.object(
          {
            authorship: fields.select({
              label: "Autorstwo",
              options: [
                { label: "Do potwierdzenia", value: "pending-confirmation" },
                { label: "Autorstwo własne", value: "own" },
                { label: "Współautorstwo", value: "coauthored" },
                {
                  label: "Materiały zewnętrzne — zgoda na publikację",
                  value: "licensed",
                },
              ],
              defaultValue: "pending-confirmation",
            }),
            note: fields.text({ label: "Notatka o prawach", multiline: true }),
          },
          { label: "Autorstwo i prawa" },
        ),
      },
    }),
  },
  singletons: {
    pages: singleton({
      label: "Teksty strony głównej i katalogu",
      previewUrl: preview("/"),
      path: "content/pages",
      format: { data: "json" },
      schema: {
        intro: copyGroup("Wprowadzenie", {
          eyebrow: "Podpis pracowni",
          headingFirst: "Nagłówek — pierwszy wiersz",
          headingSecond: "Nagłówek — drugi wiersz",
          description: "Wprowadzenie",
          projectsLink: "Przycisk projektów",
        }),
        portfolio: copyGroup("Portfolio", {
          eyebrow: "Podpis sekcji",
          heading: "Nagłówek",
          allProjectsLink: "Link do katalogu",
        }),
        about: copyGroup("O pracowni", {
          eyebrow: "Podpis sekcji",
          heading: "Nagłówek",
          lead: "Tekst wyróżniony (Enter = nowy wiersz)",
        }),
        process: copyGroup("Współpraca", {
          eyebrow: "Podpis sekcji",
          heading: "Nagłówek",
          description: "Wprowadzenie",
        }),
        reviews: copyGroup("Opinie", {
          description: "Tekst",
          link: "Etykieta linku do Google",
        }),
        contact: copyGroup("Kontakt", {
          eyebrow: "Podpis sekcji",
          heading: "Nagłówek",
          description: "Wprowadzenie",
          mapsLink: "Link do mapy",
          serviceArea: "Podpis obszaru działania",
          formHeading: "Nagłówek formularza",
          formDescription: "Opis formularza",
          submitLabel: "Przycisk wysyłania",
        }),
        footer: copyGroup("Stopka", {
          tagline: "Podpis pracowni",
          contactLink: "Link kontaktowy",
          copyrightName: "Nazwa przy prawach autorskich",
          privacyLink: "Link prywatności",
        }),
        catalog: copyGroup("Katalog projektów", {
          eyebrow: "Podpis sekcji",
          heading: "Nagłówek",
          description: "Wprowadzenie",
          seoDescription: "Opis SEO katalogu",
        }),
        navigation: copyGroup("Nawigacja", {
          homeLabel: "Opis linku strony głównej",
          mobileName: "Nazwa w menu mobilnym",
          mobileSubtitle: "Podpis w menu mobilnym",
        }),
      },
    }),
    redirects: singleton({
      label: "Przekierowania starych adresów",
      previewUrl: preview("/"),
      path: "content/redirects",
      format: { data: "json" },
      schema: {
        entries: fields.array(
          fields.object({
            source: localPath("Stary adres, np. /stary-projekt"),
            destination: localPath("Nowy adres, np. /projekty/dom-lodzkie-3"),
          }),
          {
            label: "Przekierowania trwałe",
            itemLabel: (props) =>
              props.fields.source.value || "Nowe przekierowanie",
          },
        ),
      },
    }),
    appearance: singleton({
      label: "Logo i ilustracja pracowni",
      previewUrl: preview("/"),
      path: "content/appearance",
      format: { data: "json" },
      schema: {
        logo: fields.object(
          {
            title: required("Główny napis logo"),
            subtitle: text("Drugi wiersz logo"),
            src: fields.image({
              label: "Plik logo (opcjonalnie)",
              description:
                "Zastępuje napisy w nagłówku i stopce. Usuń plik, aby przywrócić logo tekstowe. Najlepiej PNG lub WebP z przezroczystym tłem.",
              directory: "public/images/site",
              publicPath: "/images/site/",
            }),
            alt: required("Opis logo"),
          },
          { label: "Logo" },
        ),
        hero: fields.object(
          {
            src: fields.image({
              label: "Ilustracja w sekcji O pracowni",
              description:
                "Obraz warsztatu w sekcji O pracowni. Puste pole używa okładki projektu. Zdjęcie w otwarciu strony pochodzi z pierwszego wyróżnionego opublikowanego projektu.",
              directory: "public/images/site",
              publicPath: "/images/site/",
            }),
            alt: fields.text({
              label: "Opis ilustracji pracowni",
              description:
                "Opisz zawartość wybranego zdjęcia dla osób, które go nie widzą.",
              validation: { isRequired: true },
            }),
            objectFit: fields.select({
              label: "Kadrowanie ilustracji",
              options: [
                { label: "Cały obraz", value: "contain" },
                { label: "Wypełnij kadr", value: "cover" },
              ],
              defaultValue: "contain",
            }),
            objectPosition: fields.select({
              label: "Pozycja kadru",
              options: [
                { label: "Środek", value: "50% 50%" },
                { label: "Góra", value: "50% 0%" },
                { label: "Dół", value: "50% 100%" },
                { label: "Lewa strona", value: "0% 50%" },
                { label: "Prawa strona", value: "100% 50%" },
              ],
              defaultValue: "50% 50%",
            }),
          },
          { label: "Ilustracja pracowni" },
        ),
      },
    }),
    site: singleton({
      label: "Pracownia, kontakt i SEO",
      previewUrl: preview("/"),
      path: "content/site",
      format: { data: "json" },
      schema: {
        name: required("Nazwa pracowni"),
        title: required("Tytuł SEO"),
        description: fields.text({
          label: "Opis SEO",
          multiline: true,
          validation: { isRequired: true },
        }),
        phone: required("Telefon"),
        phoneHref: required("Link telefonu (tel:+48...)"),
        email: required("E-mail"),
        address: required("Adres"),
        postalAddress: fields.object(
          {
            streetAddress: required("Ulica i numer"),
            postalCode: required("Kod pocztowy"),
            addressLocality: required("Miejscowość"),
            addressRegion: required("Województwo"),
            addressCountry: required("Kod kraju (ISO 3166-1 alpha-2)"),
          },
          { label: "Adres do danych strukturalnych SEO" },
        ),
        nip: required("NIP"),
        maps: fields.url({
          label: "Google Maps",
          validation: { isRequired: true },
        }),
        serviceArea: fields.array(text("Miejscowość"), {
          label: "Obszar działania",
        }),
        about: fields.array(fields.text({ label: "Akapit", multiline: true }), {
          label: "O pracowni",
        }),
        navigation: fields.array(
          fields.object({
            label: required("Etykieta"),
            href: required("Adres"),
          }),
          {
            label: "Nawigacja",
            itemLabel: (props) => props.fields.label.value,
          },
        ),
        processSteps: fields.array(
          fields.object({
            title: required("Nazwa etapu"),
            description: fields.text({ label: "Opis", multiline: true }),
          }),
          {
            label: "Etapy współpracy",
            itemLabel: (props) => props.fields.title.value,
          },
        ),
      },
    }),
  },
});
