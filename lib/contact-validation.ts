import { z } from "zod";
export const projectTypes = [
  "Dom",
  "Obiekt usługowy",
  "Wnętrze",
  "Inny projekt",
] as const;
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Podaj imię i nazwisko (minimum 2 znaki).")
    .max(120, "Imię i nazwisko może mieć najwyżej 120 znaków.")
    .regex(/^[^\r\n]+$/, "Podaj imię i nazwisko w jednym wierszu."),
  email: z
    .string()
    .trim()
    .email("Podaj poprawny adres e-mail.")
    .max(254, "Adres e-mail jest za długi."),
  phone: z
    .string()
    .trim()
    .max(30, "Numer telefonu jest za długi.")
    .refine(
      (value) => !value || /^[+()\d\s-]{6,30}$/.test(value),
      "Podaj poprawny numer telefonu lub pozostaw pole puste.",
    ),
  projectType: z.enum(projectTypes, {
    errorMap: () => ({ message: "Wybierz rodzaj projektu." }),
  }),
  message: z
    .string()
    .trim()
    .min(20, "Opisz projekt w co najmniej 20 znakach.")
    .max(5000, "Wiadomość może mieć najwyżej 5000 znaków."),
});
export type ContactData = z.infer<typeof contactSchema>;
