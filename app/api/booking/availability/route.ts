import { NextResponse } from "next/server";

import { getAvailabilityDayPayload } from "@/app/lib/booking/availability-query";
import { BOOKING_TIMEZONE } from "@/app/lib/booking/config";
import { isGoogleCalendarConfigured } from "@/app/lib/booking/google-calendar";
import { isBookingCalendarDateAllowed } from "@/app/lib/booking/slots";
import { availabilityQuerySchema } from "@/app/lib/booking/validation";

const EMPTY_GRID = {
  slots: [] as const,
  workWindow: null,
  busy: [] as const,
  calendarTimezone: BOOKING_TIMEZONE,
  displayStartHour: 7,
  displayEndHour: 20,
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = availabilityQuerySchema.safeParse({
    date: searchParams.get("date") ?? "",
    meetingType: searchParams.get("meetingType") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Neplatné parametry požadavku.", details: parsed.error.flatten(), ...EMPTY_GRID },
      { status: 400 },
    );
  }

  const { date, meetingType } = parsed.data;

  if (!isBookingCalendarDateAllowed(date)) {
    return NextResponse.json(
      { error: "Neplatné datum pro rezervaci.", ...EMPTY_GRID },
      { status: 400 },
    );
  }

  if (!isGoogleCalendarConfigured()) {
    return NextResponse.json(
      {
        error: "Rezervace nejsou dočasně dostupné (chybí nastavení kalendáře na serveru).",
        ...EMPTY_GRID,
      },
      { status: 503 },
    );
  }

  try {
    const payload = await getAvailabilityDayPayload(date, meetingType);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[booking/availability]", e);
    const msg = e instanceof Error ? e.message : String(e);
    const is403 =
      msg.includes("403") ||
      msg.includes("Forbidden") ||
      msg.includes("insufficient") ||
      msg.includes("Insufficient Permission");
    const scopeHint =
      is403 || msg.includes("FREEBUSY")
        ? "OAuth token pravděpodobně nemá scope pro FreeBusy. V OAuth Playground zvolte https://www.googleapis.com/auth/calendar (nejjednodušší), nebo vedle calendar.events přidejte https://www.googleapis.com/auth/calendar.freebusy a znovu vygenerujte refresh token. Samotný scope calendar.events pro metodu freebusy nestačí — viz dokumentace Google k freebusy.query."
        : undefined;
    return NextResponse.json(
      {
        error: "Rezervaci se teď nepodařilo načíst. Zkuste to prosím znovu za chvíli nebo nás kontaktujte přímo.",
        ...(scopeHint ? { hint: scopeHint } : {}),
        ...EMPTY_GRID,
      },
      { status: 502 },
    );
  }
}
