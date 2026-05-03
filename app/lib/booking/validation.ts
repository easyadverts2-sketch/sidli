import { iso, z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const availabilityQuerySchema = z.object({
  date: z.string().regex(dateRegex, "Neplatné datum."),
});

export const createBookingBodySchema = z.object({
  date: z.string().regex(dateRegex),
  /** ISO 8601 instant for slot start (must match server-generated slot). */
  startTime: iso.datetime({ offset: true }),
  name: z.string().trim().min(2, "Zadejte prosím jméno a příjmení."),
  email: z.string().trim().email("Zadejte prosím platný e-mail."),
  phone: z.string().trim().min(5, "Zadejte prosím telefon."),
  message: z
    .string()
    .trim()
    .min(10, "Napište prosím stručně důvod schůzky (alespoň pár slov).")
    .max(2000),
  gdprConsent: z.literal(true, "Pro pokračování je nutný souhlas se zpracováním údajů."),
});

export type CreateBookingBody = z.infer<typeof createBookingBodySchema>;
