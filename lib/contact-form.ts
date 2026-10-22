import type { ContactData } from "./contact-validation";

export function contactBody(data: ContactData, botField = ""): URLSearchParams {
  return new URLSearchParams({
    "form-name": "kontakt-pracownia",
    ...data,
    "bot-field": botField,
  });
}

export async function sendContact(
  data: ContactData,
  botField = "",
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetcher("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: contactBody(data, botField).toString(),
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error("Usługa formularza nie przyjęła wiadomości.");
    // A plain Next dev server may return the static HTML with 200 without processing a form.
    if (!response.headers.get("x-nf-request-id"))
      throw new Error("Brak potwierdzenia usługi formularza.");
  } finally {
    clearTimeout(timer);
  }
}
