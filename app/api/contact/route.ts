import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-validation";
import { getContactAdapter } from "@/lib/contact-adapter";
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json(
      { message: "Nieobsługiwany format wiadomości." },
      { status: 415 },
    );
  if (Number(request.headers.get("content-length")) > 20000)
    return json({ message: "Wiadomość jest za długa." }, { status: 413 });
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > 20000)
      return json({ message: "Wiadomość jest za długa." }, { status: 413 });
    raw = JSON.parse(text);
  } catch {
    return json(
      { message: "Nie udało się odczytać formularza." },
      { status: 400 },
    );
  }
  const result = contactSchema.safeParse(raw);
  if (!result.success)
    return json(
      {
        message: "Popraw zaznaczone pola.",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  const adapter = getContactAdapter();
  if (!adapter)
    return json(
      {
        message:
          "Skontaktuj się bezpośrednio e-mailem lub telefonicznie. Wiadomość nie została wysłana.",
      },
      { status: 503 },
    );
  const data = result.data;
  try {
    const delivery = await adapter.send(data);
    if (!delivery.delivered) throw new Error("Delivery unavailable");
    return json({ message: "Wiadomość została wysłana." });
  } catch {
    return json(
      {
        message:
          "Nie udało się dostarczyć wiadomości. Skontaktuj się e-mailem lub telefonicznie.",
      },
      { status: 502 },
    );
  }
}

function json(body: unknown, init: ResponseInit = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      "Netlify-CDN-Cache-Control": "no-store",
      ...Object.fromEntries(new Headers(init.headers)),
    },
  });
}
