const { test } = require("node:test");
const assert = require("node:assert/strict");
require("./register.cjs");
const { contactSchema } = require("../lib/contact-validation.ts");
const { contactBody, sendContact } = require("../lib/contact-form.ts");
const valid = {
  name: "Anna Kowalska",
  email: "anna@example.test",
  phone: "",
  projectType: "Dom",
  message: "Planuję dom w Łodzi. Proszę o kontakt w sprawie koncepcji.",
};
test("formularz akceptuje poprawne dane i odrzuca puste, nieprawidłowe i zbyt długie", () => {
  assert.ok(contactSchema.safeParse(valid).success);
  assert.ok(
    contactSchema.safeParse({ ...valid, phone: "+48 600 000 000" }).success,
  );
  for (const data of [
    {},
    { ...valid, name: " " },
    { ...valid, email: "bledny" },
    { ...valid, message: "x".repeat(5001) },
    { ...valid, message: "krótko" },
    { ...valid, phone: "abc" },
    { ...valid, projectType: "inny" },
    { ...valid, name: "Anna\nBcc: test" },
  ])
    assert.equal(contactSchema.safeParse(data).success, false);
});
test("Netlify payload zachowuje polskie znaki, znaki specjalne, identyfikator i honeypot", () => {
  const data = { ...valid, message: valid.message + " & pokój? #1" };
  const body = new URLSearchParams(contactBody(data, "bot").toString());
  assert.equal(body.get("message"), data.message);
  assert.equal(body.get("form-name"), "kontakt-pracownia");
  assert.equal(body.get("bot-field"), "bot");
});
test("wysyłka wymaga potwierdzenia Netlify i propaguje błędy HTTP oraz sieci", async () => {
  let calls = 0;
  await sendContact(valid, "", async (url, options) => {
    calls++;
    assert.equal(url, "/__forms.html");
    assert.equal(options.method, "POST");
    assert.equal(
      options.headers["Content-Type"],
      "application/x-www-form-urlencoded",
    );
    assert.equal(new URLSearchParams(options.body).get("email"), valid.email);
    return new Response("", { headers: { "x-nf-request-id": "qa" } });
  });
  assert.equal(calls, 1);
  await assert.rejects(
    sendContact(valid, "", async () => new Response("", { status: 503 })),
  );
  await assert.rejects(
    sendContact(
      valid,
      "",
      async () => new Response("<html>static file</html>"),
    ),
  );
  await assert.rejects(
    sendContact(valid, "", async () => {
      throw new TypeError("Network unavailable");
    }),
  );
});
