import { addDays, addMinutes, isAfter, isBefore } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import {
  BOOKING_SLOT_DURATION_MINUTES,
  BOOKING_TIMEZONE,
  BUFFER_AFTER_MEETING_MINUTES,
  MAX_BOOKING_DAYS_AHEAD,
  MIN_BOOKING_LEAD_HOURS,
  SLOT_GRID_MINUTES,
  getWorkWindowMinutesForDay,
} from "./config";
import type { BusyInterval, TimeSlot } from "./types";

function pragueWallToUtc(isoLocal: string): Date {
  return toDate(isoLocal, { timeZone: BOOKING_TIMEZONE });
}

function utcToPragueLabel(d: Date): string {
  return formatInTimeZone(d, BOOKING_TIMEZONE, "HH:mm");
}

/**
 * Candidate slots for a calendar day in Prague, before busy filtering.
 * Respects work hours, {@link BOOKING_SLOT_DURATION_MINUTES}, grid, min lead and max horizon.
 */
export function generateSlotsForDay(dateStr: string, now: Date = new Date()): TimeSlot[] {
  const dayStart = pragueWallToUtc(`${dateStr}T00:00:00`);

  if (Number.isNaN(dayStart.getTime())) return [];

  const isoDow = parseInt(formatInTimeZone(dayStart, BOOKING_TIMEZONE, "i"), 10);
  const window = getWorkWindowMinutesForDay(isoDow);
  if (!window) return [];

  const maxDate = addMinutes(now, MAX_BOOKING_DAYS_AHEAD * 24 * 60);
  if (isAfter(dayStart, maxDate)) return [];

  const minStart = addMinutes(now, MIN_BOOKING_LEAD_HOURS * 60);

  const { start: winStartMin, end: winEndMin } = window;
  const duration = BOOKING_SLOT_DURATION_MINUTES;

  const slots: TimeSlot[] = [];

  for (let m = winStartMin; m + duration <= winEndMin; m += SLOT_GRID_MINUTES) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    const localIso = `${dateStr}T${pad(h)}:${pad(min)}:00`;
    const start = pragueWallToUtc(localIso);
    const end = addMinutes(start, duration);

    if (isBefore(start, minStart)) continue;

    const workEndInstant = pragueWallToUtc(
      `${dateStr}T${pad(Math.floor(winEndMin / 60))}:${pad(winEndMin % 60)}:00`,
    );
    if (isAfter(end, workEndInstant)) continue;

    slots.push({
      start: start.toISOString(),
      end: end.toISOString(),
      label: utcToPragueLabel(start),
    });
  }

  return slots;
}

/**
 * Returns true if [slotStart, slotEnd] overlaps any extended busy block.
 * Each busy block is extended by `bufferMinutes` at the end (cleanup / gap).
 */
export function slotConflictsWithBusy(
  slotStart: Date,
  slotEnd: Date,
  busyIntervals: BusyInterval[],
  bufferMinutes: number,
): boolean {
  for (const b of busyIntervals) {
    const extEnd = addMinutes(b.end, bufferMinutes);
    if (slotStart < extEnd && slotEnd > b.start) return true;
  }
  return false;
}

export function filterAvailableSlots(
  slots: TimeSlot[],
  busyIntervals: BusyInterval[],
  bufferMinutes: number = BUFFER_AFTER_MEETING_MINUTES,
): TimeSlot[] {
  return slots.filter((s) => {
    const start = new Date(s.start);
    const end = new Date(s.end);
    return !slotConflictsWithBusy(start, end, busyIntervals, bufferMinutes);
  });
}

/** RFC3339 bounds for FreeBusy for one calendar day in BOOKING_TIMEZONE. */
export function pragueDayToUtcRange(dateStr: string): { timeMin: string; timeMax: string } {
  const start = toDate(`${dateStr}T00:00:00`, { timeZone: BOOKING_TIMEZONE });
  const end = toDate(`${dateStr}T23:59:59.999`, { timeZone: BOOKING_TIMEZONE });
  return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}

export function pragueCalendarDateFromUtcInstant(iso: string): string {
  return formatInTimeZone(new Date(iso), BOOKING_TIMEZONE, "yyyy-MM-dd");
}

export function getPragueTodayString(now: Date = new Date()): string {
  return formatInTimeZone(now, BOOKING_TIMEZONE, "yyyy-MM-dd");
}

export function getPragueMaxBookableDateString(now: Date = new Date()): string {
  const today = getPragueTodayString(now);
  const base = toDate(`${today}T12:00:00`, { timeZone: BOOKING_TIMEZONE });
  return formatInTimeZone(addDays(base, MAX_BOOKING_DAYS_AHEAD), BOOKING_TIMEZONE, "yyyy-MM-dd");
}

/** First `yyyy-MM-dd` in Prague on which any slot could exist (respects MIN_BOOKING_LEAD_HOURS). */
export function getFirstBookableCalendarDateStr(now: Date = new Date()): string {
  const minInstant = addMinutes(now, MIN_BOOKING_LEAD_HOURS * 60);
  return formatInTimeZone(minInstant, BOOKING_TIMEZONE, "yyyy-MM-dd");
}

/** Calendar day is in range and falls on a configured workday (Mon–Fri per config). */
export function isBookingCalendarDateAllowed(dateStr: string, now: Date = new Date()): boolean {
  const today = getPragueTodayString(now);
  const max = getPragueMaxBookableDateString(now);
  const firstBookable = getFirstBookableCalendarDateStr(now);
  if (dateStr < today || dateStr > max || dateStr < firstBookable) return false;
  const noon = toDate(`${dateStr}T12:00:00`, { timeZone: BOOKING_TIMEZONE });
  const isoDow = parseInt(formatInTimeZone(noon, BOOKING_TIMEZONE, "i"), 10);
  return getWorkWindowMinutesForDay(isoDow) !== null;
}
