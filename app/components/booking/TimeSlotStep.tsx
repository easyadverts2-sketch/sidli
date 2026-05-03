"use client";

import { useEffect, useState } from "react";

import { getMeetingTypeById } from "@/app/lib/booking/config";
import type { AvailabilityDayPayload, MeetingTypeId, TimeSlot } from "@/app/lib/booking/types";

import { BookingError } from "./BookingError";
import { DayTimelineGrid } from "./DayTimelineGrid";

type TimeSlotStepProps = {
  meetingType: MeetingTypeId;
  date: string;
  value: TimeSlot | null;
  onChange: (slot: TimeSlot) => void;
};

const FALLBACK_PAYLOAD: AvailabilityDayPayload = {
  slots: [],
  workWindow: null,
  busy: [],
  calendarTimezone: "Europe/Prague",
  displayStartHour: 7,
  displayEndHour: 20,
};

export function TimeSlotStep({ meetingType, date, value, onChange }: TimeSlotStepProps) {
  const [payload, setPayload] = useState<AvailabilityDayPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);

  const meeting = getMeetingTypeById(meetingType);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      setHttpStatus(null);
      try {
        const res = await fetch(
          `/api/booking/availability?date=${encodeURIComponent(date)}&meetingType=${encodeURIComponent(meetingType)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as AvailabilityDayPayload & { error?: string };
        if (cancelled) return;
        setHttpStatus(res.status);
        if (!res.ok) {
          setError(data.error ?? "Nepodařilo se načíst dostupné časy.");
          setPayload({
            ...FALLBACK_PAYLOAD,
            calendarTimezone: data.calendarTimezone ?? FALLBACK_PAYLOAD.calendarTimezone,
            displayStartHour: data.displayStartHour ?? FALLBACK_PAYLOAD.displayStartHour,
            displayEndHour: data.displayEndHour ?? FALLBACK_PAYLOAD.displayEndHour,
          });
          return;
        }
        setPayload({
          slots: data.slots ?? [],
          workWindow: data.workWindow ?? null,
          busy: data.busy ?? [],
          calendarTimezone: data.calendarTimezone ?? FALLBACK_PAYLOAD.calendarTimezone,
          displayStartHour: data.displayStartHour ?? FALLBACK_PAYLOAD.displayStartHour,
          displayEndHour: data.displayEndHour ?? FALLBACK_PAYLOAD.displayEndHour,
        });
        if ((data.slots?.length ?? 0) === 0 && res.ok) {
          setError("Pro tento den už nejsou dostupné žádné termíny.");
        }
      } catch {
        if (!cancelled) {
          setError("Nepodařilo se načíst dostupné časy.");
          setPayload(FALLBACK_PAYLOAD);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [date, meetingType]);

  if (loading || !payload || !meeting) {
    return (
      <div className="space-y-3" aria-busy="true">
        <p className="text-sm text-muted">Načítám kalendář a volné termíny…</p>
        <div className="h-64 animate-pulse rounded-xl bg-[var(--surface-elevated)]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <BookingError message={error} /> : null}
      {httpStatus === 503 ? (
        <p className="text-sm text-muted">
          Zkontrolujte na serveru proměnné <code className="rounded bg-[var(--surface-elevated)] px-1">GOOGLE_CLIENT_ID</code>,{" "}
          <code className="rounded bg-[var(--surface-elevated)] px-1">GOOGLE_CLIENT_SECRET</code> a{" "}
          <code className="rounded bg-[var(--surface-elevated)] px-1">GOOGLE_REFRESH_TOKEN</code>.
        </p>
      ) : null}
      <DayTimelineGrid
        dateStr={date}
        timezone={payload.calendarTimezone}
        displayStartHour={payload.displayStartHour}
        displayEndHour={payload.displayEndHour}
        workWindow={payload.workWindow}
        busy={payload.busy}
        slots={payload.slots}
        meetingDurationMinutes={meeting.durationMinutes}
        value={value}
        onSelect={onChange}
      />
    </div>
  );
}
