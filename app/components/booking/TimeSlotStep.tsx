"use client";

import { useEffect, useState } from "react";

import { BOOKING_SLOT_DURATION_MINUTES } from "@/app/lib/booking/config";
import type { AvailabilityDayPayload, TimeSlot } from "@/app/lib/booking/types";

import { BookingError } from "./BookingError";
import { DayTimelineGrid } from "./DayTimelineGrid";

type TimeSlotStepProps = {
  date: string;
  value: TimeSlot | null;
  onChange: (slot: TimeSlot) => void;
};

export function TimeSlotStep({ date, value, onChange }: TimeSlotStepProps) {
  const [payload, setPayload] = useState<AvailabilityDayPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      setHttpStatus(null);
      setPayload(null);
      try {
        const res = await fetch(`/api/booking/availability?date=${encodeURIComponent(date)}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as AvailabilityDayPayload & {
          error?: string;
          hint?: string;
          diagnostic?: string;
        };
        if (cancelled) return;
        setHttpStatus(res.status);
        if (!res.ok) {
          const base = data.error ?? "Nepodařilo se načíst dostupné časy.";
          const extra = [data.hint, data.diagnostic ? `Diagnostika (server / Google): ${data.diagnostic}` : ""]
            .filter(Boolean)
            .join("\n\n");
          setError(extra ? `${base}\n\n${extra}` : base);
          return;
        }
        setPayload({
          slots: data.slots ?? [],
          workWindow: data.workWindow ?? null,
          busy: data.busy ?? [],
          calendarTimezone: data.calendarTimezone ?? "Europe/Prague",
          displayStartHour: data.displayStartHour ?? 7,
          displayEndHour: data.displayEndHour ?? 20,
        });
        if ((data.slots?.length ?? 0) === 0) {
          setError("Pro tento den už nejsou dostupné žádné termíny.");
        }
      } catch {
        if (!cancelled) {
          setError("Nepodařilo se načíst dostupné časy (síť nebo neplatná odpověď serveru).");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [date]);

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true">
        <p className="text-sm text-muted">Načítám kalendář a volné termíny…</p>
        <div className="h-64 animate-pulse rounded-xl bg-[var(--surface-elevated)]" />
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="space-y-4">
        {error ? <BookingError message={error} /> : <BookingError message="Nepodařilo se načíst data kalendáře." />}
        {httpStatus === 503 ? (
          <p className="text-sm text-muted">
            Zkontrolujte na serveru proměnné <code className="rounded bg-[var(--surface-elevated)] px-1">GOOGLE_CLIENT_ID</code>,{" "}
            <code className="rounded bg-[var(--surface-elevated)] px-1">GOOGLE_CLIENT_SECRET</code> a{" "}
            <code className="rounded bg-[var(--surface-elevated)] px-1">GOOGLE_REFRESH_TOKEN</code>.
          </p>
        ) : null}
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
        meetingDurationMinutes={BOOKING_SLOT_DURATION_MINUTES}
        value={value}
        onSelect={onChange}
      />
    </div>
  );
}
