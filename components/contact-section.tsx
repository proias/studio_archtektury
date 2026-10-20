"use client";
import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site-content";
import {
  contactSchema,
  projectTypes,
  buildMailto,
} from "@/lib/contact-validation";
export function ContactSection() {
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
      {},
    ),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setStatus("Popraw zaznaczone pola.");
      const field = result.error.issues[0]?.path[0];
      if (field)
        (form.elements.namedItem(String(field)) as HTMLElement)?.focus();
      return;
    }
    setErrors({});
    setBusy(true);
    window.location.href = buildMailto(result.data, site.email);
    setStatus(
      "Przygotowano treść do programu pocztowego. Wyślij ją z własnej skrzynki. Jeśli program się nie otworzył, napisz bezpośrednio na podany adres e-mail.",
    );
    setBusy(false);
  }
  const fieldError = (name: string) =>
    errors[name]?.length ? (
      <p className="field-error" id={name + "-error"}>
        {errors[name]![0]}
      </p>
    ) : null;
  const a11y = (name: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? name + "-error" : undefined,
  });
  return (
    <section id="kontakt" className="section dark-section contact-section">
      <div className="container contact-columns">
        <div>
          <p className="eyebrow">Kontakt</p>
          <h2>
            Porozmawiajmy
            <br />o Twoim projekcie.
          </h2>
          <p className="contact-intro">
            Opowiedz o planowanej inwestycji, jej lokalizacji i zakresie. To
            dobry punkt wyjścia do pierwszej rozmowy.
          </p>
          <address>
            <a className="contact-email" href={"mailto:" + site.email}>
              {site.email}
            </a>
            <a href={site.phoneHref}>{site.phone}</a>
            <p>{site.address}</p>
            <a
              className="text-link"
              href={site.maps}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wyznacz trasę <ArrowUpRight size={17} />
            </a>
          </address>
          <p className="service-area">
            <span>Obszar współpracy</span>
            {site.serviceArea.join(" · ")}
          </p>
        </div>
        <div className="contact-form-wrap">
          <h3>Napisz o swoim pomyśle</h3>
          <p className="form-note">
            Uzupełnij szczegóły i otwórz program pocztowy z przygotowaną
            treścią. Możesz też napisać lub zadzwonić bezpośrednio.
          </p>
          <form noValidate onSubmit={submit}>
            <div className="form-row">
              <div>
                <label htmlFor="contact-name">Imię i nazwisko *</label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  {...a11y("name")}
                />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor="contact-email">E-mail *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  {...a11y("email")}
                />
                {fieldError("email")}
              </div>
            </div>
            <div className="form-row">
              <div>
                <label htmlFor="contact-phone">
                  Telefon <span>(opcjonalnie)</span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  {...a11y("phone")}
                />
                {fieldError("phone")}
              </div>
              <div>
                <label htmlFor="contact-type">Rodzaj projektu *</label>
                <select
                  id="contact-type"
                  name="projectType"
                  required
                  defaultValue=""
                  {...a11y("projectType")}
                >
                  <option value="" disabled>
                    Wybierz rodzaj
                  </option>
                  {projectTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                {fieldError("projectType")}
              </div>
            </div>
            <div>
              <label htmlFor="contact-message">Wiadomość *</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                minLength={20}
                maxLength={5000}
                placeholder="Lokalizacja, potrzeby, planowany zakres…"
                {...a11y("message")}
              />
              {fieldError("message")}
            </div>
            <p className="form-note">
              * Pola wymagane. Dane pozostają w przeglądarce do chwili wysłania
              wiadomości w Twoim programie pocztowym.
            </p>
            <button className="contact-submit" disabled={busy} type="submit">
              {busy ? "Przygotowywanie…" : "Otwórz program pocztowy"}
              <ArrowUpRight size={18} />
            </button>
            <p className="form-status" role="status" aria-live="polite">
              {status}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
