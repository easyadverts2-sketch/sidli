import { NextResponse } from "next/server";

import { getAvailableSlotsForDay } from "@/app/lib/booking/availability-query";
import { BOOKING_EVENT_LABEL, BOOKING_SOURCE_LINE } from "@/app/lib/booking/config";
import { createBookingEvent, isGoogleCalendarConfigured } from "@/app/lib/booking/google-calendar";
import { formatGoogleApiError } from "@/app/lib/booking/google-errors";
import { sanitizeCalendarText } from "@/app/lib/booking/sanitize";
import { pragueCalendarDateFromUtcInstant } from "@/app/lib/booking/slots";
import { createBookingBodySchema } from "@/app/lib/booking/validation";

// TODO: add durable rate limiting (e.g. Redis / edge middleware) per IP + email.

function buildEventDescription(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): string {
  const msg = sanitizeCalendarText(input.message, 2000);
  return [
    "Nová rezervace z webu.",
    "",
    `Důvod schůzky: ${msg}`,
    "",
    `Jméno: ${sanitizeCalendarText(input.name, 200)}`,
    `E-mail: ${sanitizeCalendarText(input.email, 120)}`,
    `Telefon: ${sanitizeCalendarText(input.phone, 40)}`,
    "",
    "Souhlas se zpracováním údajů: Ano",
    `Zdroj: ${BOOKING_SOURCE_LINE}`,
  ].join("\n");
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný formát požadavku." }, { status: 400 });
  }

  const parsed = createBookingBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Zkontrolujte prosím vyplněné údaje.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const body = parsed.data;

  const pragueDate = pragueCalendarDateFromUtcInstant(body.startTime);
  if (pragueDate !== body.date) {
    return NextResponse.json({ error: "Datum neodpovídá zvolenému času." }, { status: 400 });
  }

  if (!isGoogleCalendarConfigured()) {
    return NextResponse.json(
      { error: "Rezervaci se teď nepodařilo dokončit. Zkuste to prosím znovu za chvíli nebo nás kontaktujte přímo." },
      { status: 503 },
    );
  }

  let available: Awaited<ReturnType<typeof getAvailableSlotsForDay>>;
  try {
    available = await getAvailableSlotsForDay(body.date);
  } catch (e) {
    console.error("[booking/create] freebusy", e);
    return NextResponse.json(
      {
        error: "Rezervaci se teď nepodařilo dokončit. Zkuste to prosím znovu za chvíli nebo nás kontaktujte přímo.",
        diagnostic: formatGoogleApiError(e),
      },
      { status: 502 },
    );
  }

  const chosen = available.find((s) => s.start === body.startTime);
  if (!chosen) {
    return NextResponse.json(
      { error: "Tenhle termín už bohužel není dostupný. Vyberte prosím jiný čas." },
      { status: 409 },
    );
  }

  const ownerEmail = process.env.BOOKING_OWNER_EMAIL?.trim();
  const attendeeSet = new Set<string>([body.email.toLowerCase()]);
  if (ownerEmail) attendeeSet.add(ownerEmail.toLowerCase());
  const attendeeEmails = [...attendeeSet];

  const createMeet =
    process.env.BOOKING_CREATE_MEET_LINK === "1" || process.env.BOOKING_CREATE_MEET_LINK === "true";

  const summary = `Schůzka – ${BOOKING_EVENT_LABEL} – ${sanitizeCalendarText(body.name, 200)}`;

  try {
    const { htmlLink } = await createBookingEvent({
      summary,
      description: buildEventDescription({
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message,
      }),
      startIso: chosen.start,
      endIso: chosen.end,
      attendeeEmails,
      createMeetLink: createMeet,
    });

    const reasonPreview = body.message.length > 120 ? `${body.message.slice(0, 120)}…` : body.message;

    return NextResponse.json({
      ok: true,
      htmlLink: htmlLink ?? null,
      reservation: {
        date: body.date,
        timeLabel: chosen.label,
        name: body.name,
        email: body.email,
        reasonPreview,
      },
    });
  } catch (e) {
    console.error("[booking/create] insert", e);
    return NextResponse.json(
      {
        error: "Rezervaci se teď nepodařilo dokončit. Zkuste to prosím znovu za chvíli nebo nás kontaktujte přímo.",
        diagnostic: formatGoogleApiError(e),
      },
      { status: 502 },
    );
  }
}
