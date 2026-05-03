"use client";

import { addDays } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";

import { BOOKING_TIMEZONE, MAX_BOOKING_DAYS_AHEAD } from "@/app/lib/booking/config";
import { getPragueTodayString, isBookingCalendarDateAllowed } from "@/app/lib/booking/slots";

function listSelectableDates(): string[] {
  const now = new Date();
  const today = getPragueTodayString(now);
  const base = toDate(`${today}T12:00:00`, { timeZone: BOOKING_TIMEZONE });
  const out: string[] = [];
  for (let i = 0; i <= MAX_BOOKING_DAYS_AHEAD; i += 1) {
    const d = addDays(base, i);
    const ymd = formatInTimeZone(d, BOOKING_TIMEZONE, "yyyy-MM-dd");
    if (isBookingCalendarDateAllowed(ymd, now)) out.push(ymd);
  }
  return out;
}

function formatChip(ymd: string): string {
  const d = toDate(`${ymd}T12:00:00`, { timeZone: BOOKING_TIMEZONE });
  return new Intl.DateTimeFormat("cs-CZ", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(d);
}

type DateStepProps = {
  value: string | null;
  onChange: (ymd: string) => void;
};

export function DateStep({ value, onChange }: DateStepProps) {
  const dates = listSelectableDates();

  return (
    <div className="booking-dates">
      {dates.map((ymd) => (
        <button
          key={ymd}
          type="button"
          className={`booking-chip ${value === ymd ? "active" : ""}`}
          onClick={() => onChange(ymd)}
        >
          {formatChip(ymd)}
        </button>
      ))}
    </div>
  );
}
