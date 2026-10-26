"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site-content";
import { contactSchema, projectTypes } from "@/lib/contact-validation";
import { sendContact } from "@/lib/contact-form";
import { pageCopy } from "@/lib/page-content";
import { TextLines } from "./text-lines";
export function ContactSection() {
  const submitting = useRef(false);
  const [failed, setFailed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
      {},
    ),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setStatus("");
    setFailed(false);
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
    submitting.current = true;
    setBusy(true);
    try {
      if (process.env.NEXT_PUBLIC_CONTACT_ENABLED !== "true")
        throw new Error("Formularz wymaga wdrożenia Netlify.");
      await sendContact(result.data, String(data["bot-field"] || ""));
      setStatus(
        "Dziękujemy. Zgłoszenie zostało przyjęte przez formularz pracowni.",
      );
      form.reset();
    } catch {
      setFailed(true);
      setStatus(
        "Nie udało się potwierdzić przyjęcia wiadomości. Dane pozostały w formularzu. Spróbuj ponownie lub skontaktuj się e-mailem albo telefonicznie.",
      );
    } finally {
      setBusy(false);
      submitting.current = false;
    }
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
    <section
      id="kontakt"
      className="section dark-section contact-section"
      data-section="Kontakt"
    >
      <div className="container contact-columns">
        <div>
          <p className="eyebrow">{pageCopy.contact.eyebrow}</p>
          <h2>
            <TextLines text={pageCopy.contact.heading} />
          </h2>
          <p className="contact-intro">{pageCopy.contact.description}</p>
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
              {pageCopy.contact.mapsLink} <ArrowUpRight size={17} />
            </a>
          </address>
          <p className="service-area">
            <span>{pageCopy.contact.serviceArea}</span>
            {site.serviceArea.join(" · ")}
          </p>
        </div>
        <div className="contact-form-wrap">
          <div className="brief-card-top">
            <span>Twój nowy rozdział</span>
            <span>Karta briefu / 01</span>
          </div>
          <h3>{pageCopy.contact.formHeading}</h3>
          <p className="form-note">{pageCopy.contact.formDescription}</p>
          <form
            name="kontakt-pracownia"
            method="POST"
            action="/__forms.html"
            noValidate
            onSubmit={submit}
            aria-busy={busy}
          >
            <input type="hidden" name="form-name" value="kontakt-pracownia" />
            <div hidden aria-hidden="true">
              <label>
                Nie wypełniaj tego pola
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
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
              * Pola wymagane. Wysłane dane przetwarza pracownia za
              pośrednictwem Netlify Forms.{" "}
              <a href="/prywatnosc">Informacje o prywatności</a>.
            </p>
            <button className="contact-submit" disabled={busy} type="submit">
              {busy ? "Wysyłanie…" : pageCopy.contact.submitLabel}
              <ArrowUpRight size={18} />
            </button>
            <p
              className="form-status"
              role={failed ? "alert" : "status"}
              aria-live={failed ? "assertive" : "polite"}
            >
              {status}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
