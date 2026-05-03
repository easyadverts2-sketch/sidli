import { iso, z } from "zod";

import { MEETING_TYPES } from "./config";
import type { MeetingTypeId } from "./types";

const meetingTypeTuple = MEETING_TYPES.map((m) => m.id) as [MeetingTypeId, ...MeetingTypeId[]];

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const availabilityQuerySchema = z.object({
  date: z.string().regex(dateRegex, "Neplatné datum."),
  meetingType: z.enum(meetingTypeTuple),
});

export const createBookingBodySchema = z.object({
  meetingType: z.enum(meetingTypeTuple),
  date: z.string().regex(dateRegex),
  /** ISO 8601 instant for slot start (must match server-generated slot). */
  startTime: iso.datetime({ offset: true }),
  name: z.string().trim().min(2, "Zadejte prosím jméno a příjmení."),
  email: z.string().trim().email("Zadejte prosím platný e-mail."),
  phone: z.string().trim().min(5, "Zadejte prosím telefon."),
  message: z.string().trim().max(2000).optional().default(""),
  gdprConsent: z.literal(true, "Pro pokračování je nutný souhlas se zpracováním údajů."),
});

export type CreateBookingBody = z.infer<typeof createBookingBodySchema>;
