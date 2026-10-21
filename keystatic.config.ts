import { collection, config, fields, singleton } from "@keystatic/core";
import { categories } from "./lib/projects";

// Only public configuration is used here: this module is also bundled for the admin UI.
const github = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "github";
const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;
if (github && !repo?.match(/^[\w.-]+\/[\w.-]+$/)) {
  throw new Error("Set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO to owner/repository.");
}
const text = (label: string) => fields.text({ label });
const required = (label: string) =>
  fields.text({ label, validation: { isRequired: true } });
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
  storage: github
    ? { kind: "github", repo: repo as `${string}/${string}` }
    : { kind: "local" },
  ui: { brand: { name: "Cywińska Studio — CMS" } },
  collections: {
    projects: collection({
      label: "Projekty",
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
            "Zachowane zasady podglądu: szkic i opublikowany są w katalogu; do potwierdzenia tylko pod bezpośrednim adresem.",
          options: [
            { label: "Szkic (widoczny w podglądzie)", value: "draft" },
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
    site: singleton({
      label: "Pracownia, kontakt i SEO",
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
