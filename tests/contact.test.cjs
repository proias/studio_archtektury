const { test } = require("node:test");
const assert = require("node:assert/strict");
require("./register.cjs");
const { contactSchema, buildMailto } = require("../lib/contact-validation.ts");
const valid = {
  name: "Anna Kowalska",
  email: "anna@example.test",
  phone: "",
  projectType: "Dom",
  message: "Planuję dom w Łodzi. Proszę o kontakt w sprawie koncepcji.",
};
test("accepts complete valid data with optional phone", () => {
  assert.ok(contactSchema.safeParse(valid).success);
  assert.ok(
    contactSchema.safeParse({ ...valid, phone: "+48 600 000 000" }).success,
  );
});
test("rejects blank or invalid required fields and excessive content", () => {
  for (const data of [
    {},
    { ...valid, name: " " },
    { ...valid, email: "bledny" },
    { ...valid, projectType: "nieznany" },
    { ...valid, message: "krótko" },
    { ...valid, message: "x".repeat(5001) },
    { ...valid, phone: "abc" },
    { ...valid, name: "Anna\nBcc: example" },
  ])
    assert.equal(contactSchema.safeParse(data).success, false);
});
test("mail draft encodes Polish characters and user input safely", () => {
  const result = buildMailto(
    contactSchema.parse({
      ...valid,
      message: valid.message + " & drugi pokój? #1",
    }),
    "pcywinska.arch@gmail.com",
  );
  const url = new URL(result);
  assert.equal(url.pathname, "pcywinska.arch@gmail.com");
  assert.equal(url.searchParams.get("subject"), "Zapytanie o projekt: Dom");
  assert.ok(url.searchParams.get("body").includes("Łodzi"));
  assert.ok(url.searchParams.get("body").includes("& drugi pokój? #1"));
  assert.ok(!result.includes("Wiadomość wysłana"));
});
