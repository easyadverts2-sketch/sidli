"use client";

import { toDate } from "date-fns-tz";

import type { BusyBlockIso, TimeSlot, WorkWindowDto } from "@/app/lib/booking/types";

type DayTimelineGridProps = {
  dateStr: string;
  timezone: string;
  displayStartHour: number;
  displayEndHour: number;
  workWindow: WorkWindowDto | null;
  busy: BusyBlockIso[];
  slots: TimeSlot[];
  meetingDurationMinutes: number;
  value: TimeSlot | null;
  onSelect: (s: TimeSlot) => void;
};

const ROW_REM = 2.35;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function minutesToLocalIso(dateStr: string, minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${dateStr}T${pad2(h)}:${pad2(m)}:00`;
}

function segmentPercent(
  rangeStart: Date,
  rangeEnd: Date,
  segStart: Date,
  segEnd: Date,
): { topPct: number; heightPct: number } | null {
  const t0 = rangeStart.getTime();
  const t1 = rangeEnd.getTime();
  const s = Math.max(segStart.getTime(), t0);
  const e = Math.min(segEnd.getTime(), t1);
  if (s >= e) return null;
  const span = t1 - t0;
  return { topPct: ((s - t0) / span) * 100, heightPct: ((e - s) / span) * 100 };
}

export function DayTimelineGrid({
  dateStr,
  timezone,
  displayStartHour,
  displayEndHour,
  workWindow,
  busy,
  slots,
  meetingDurationMinutes,
  value,
  onSelect,
}: DayTimelineGridProps) {
  const rangeStart = toDate(`${dateStr}T${pad2(displayStartHour)}:00:00`, { timeZone: timezone });
  const rangeEnd = toDate(`${dateStr}T${pad2(displayEndHour)}:00:00`, { timeZone: timezone });

  const workStart =
    workWindow != null ? toDate(minutesToLocalIso(dateStr, workWindow.startMinute), { timeZone: timezone }) : null;
  const workEnd =
    workWindow != null ? toDate(minutesToLocalIso(dateStr, workWindow.endMinute), { timeZone: timezone }) : null;

  const nonWorkSegments: { topPct: number; heightPct: number }[] = [];
  if (workWindow != null && workStart && workEnd) {
    const a = segmentPercent(rangeStart, rangeEnd, rangeStart, workStart);
    const b = segmentPercent(rangeStart, rangeEnd, workEnd, rangeEnd);
    if (a) nonWorkSegments.push(a);
    if (b) nonWorkSegments.push(b);
  } else {
    nonWorkSegments.push({ topPct: 0, heightPct: 100 });
  }

  const busySegments: { topPct: number; heightPct: number }[] = [];
  for (const b of busy) {
    const seg = segmentPercent(rangeStart, rangeEnd, new Date(b.start), new Date(b.end));
    if (seg) busySegments.push(seg);
  }

  const slotSegments = slots.map((slot) => {
    const seg = segmentPercent(rangeStart, rangeEnd, new Date(slot.start), new Date(slot.end));
    return { slot, seg };
  });

  const hours: number[] = [];
  for (let h = displayStartHour; h < displayEndHour; h += 1) hours.push(h);
  const trackHeight = `${hours.length * ROW_REM}rem`;

  const workBand = workStart && workEnd ? segmentPercent(rangeStart, rangeEnd, workStart, workEnd) : null;

  return (
    <div className="mt-2">
      <p className="mb-2 text-xs text-muted">
        Šedá = mimo pracovní dobu (např. 7–9 a po konci směny až do 20:00 v náhledu). Tmavší pruh = obsazeno
        (Google Calendar FreeBusy + rezervační mezera). Zvýrazněné obdélníky = volné termíny — kliknutím vyberete.
      </p>
      <div className="flex gap-2 overflow-x-auto">
        <div
          className="flex w-11 shrink-0 flex-col text-right text-[11px] text-muted"
          style={{ height: trackHeight }}
        >
          {hours.map((h) => (
            <div
              key={h}
              style={{ height: `${ROW_REM}rem` }}
              className="flex items-start justify-end border-t border-[var(--border)]/50 pr-1 pt-0.5"
            >
              {h}:00
            </div>
          ))}
        </div>
        <div
          className="relative min-w-[200px] flex-1 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
          style={{ height: trackHeight }}
        >
          <div className="pointer-events-none absolute inset-0 z-0 flex flex-col">
            {hours.map((h) => (
              <div
                key={h}
                style={{ height: `${ROW_REM}rem` }}
                className="border-t border-[var(--border)]/55"
              />
            ))}
          </div>

          {workBand ? (
            <div
              className="pointer-events-none absolute right-0 left-0 z-[1] bg-emerald-500/8"
              style={{
                top: `${workBand.topPct}%`,
                height: `${Math.max(workBand.heightPct, 0.4)}%`,
              }}
            />
          ) : null}

          {nonWorkSegments.map((seg, i) => (
            <div
              key={`nw-${i}`}
              className="pointer-events-none absolute right-0 left-0 z-[2] bg-zinc-900/20"
              style={{ top: `${seg.topPct}%`, height: `${Math.max(seg.heightPct, 0.35)}%` }}
            />
          ))}

          {busySegments.map((seg, i) => (
            <div
              key={`b-${i}`}
              className="pointer-events-none absolute right-0 left-0 z-[3] bg-zinc-900/38"
              style={{ top: `${seg.topPct}%`, height: `${Math.max(seg.heightPct, 0.3)}%` }}
            />
          ))}

          {workWindow == null ? (
            <div className="pointer-events-none absolute inset-0 z-[30] flex items-center justify-center bg-white/80 p-3 text-center text-sm font-semibold text-muted backdrop-blur-[1px]">
              Tento den máme zavřeno.
            </div>
          ) : null}

          {slotSegments.map(({ slot, seg }) => {
            if (!seg) return null;
            const selected = value?.start === slot.start;
            return (
              <button
                key={slot.start}
                type="button"
                title={`${slot.label} · ${meetingDurationMinutes} min`}
                className={`absolute right-2 left-2 z-20 rounded-lg border-2 text-left text-sm font-semibold shadow-sm transition-transform hover:z-[25] hover:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
                  selected
                    ? "border-[var(--primary-deep)] bg-[rgba(209,250,229,0.96)] text-[var(--primary-deep)]"
                    : "border-[rgba(5,150,105,0.5)] bg-white/95 text-foreground hover:border-[var(--primary)]"
                }`}
                style={{
                  top: `calc(${seg.topPct}% + 1px)`,
                  height: `calc(${Math.max(seg.heightPct, 5.5)}% - 2px)`,
                  minHeight: "2.6rem",
                }}
                onClick={() => onSelect(slot)}
              >
                <span className="block px-2 py-1.5">
                  {slot.label} – {meetingDurationMinutes} min
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
