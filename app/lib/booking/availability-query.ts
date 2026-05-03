import { addMinutes } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";

import {
  BOOKING_TIMEZONE,
  BUFFER_AFTER_MEETING_MINUTES,
  getWorkWindowMinutesForDay,
} from "./config";
import { getBusyIntervals } from "./google-calendar";
import type { AvailabilityDayPayload, TimeSlot, WorkWindowDto } from "./types";
import { filterAvailableSlots, generateSlotsForDay, pragueDayToUtcRange } from "./slots";

const DISPLAY_START_HOUR = 7;
const DISPLAY_END_HOUR = 20;

/**
 * FreeBusy + generated slots + work window for one Prague calendar day.
 * Matches Google Calendar API: freebusy.query returns busy[]; we never expose event titles.
 */
export async function getAvailabilityDayPayload(dateStr: string): Promise<AvailabilityDayPayload> {
  const { timeMin, timeMax } = pragueDayToUtcRange(dateStr);
  const busy = await getBusyIntervals(timeMin, timeMax);

  const busyBlocks = busy.map((b) => ({
    start: b.start.toISOString(),
    end: addMinutes(b.end, BUFFER_AFTER_MEETING_MINUTES).toISOString(),
  }));

  const noon = toDate(`${dateStr}T12:00:00`, { timeZone: BOOKING_TIMEZONE });
  const isoDow = parseInt(formatInTimeZone(noon, BOOKING_TIMEZONE, "i"), 10);
  const rawWindow = getWorkWindowMinutesForDay(isoDow);
  const workMinuteWindow: WorkWindowDto | null = rawWindow
    ? { startMinute: rawWindow.start, endMinute: rawWindow.end }
    : null;

  const candidates = generateSlotsForDay(dateStr);
  const slots = filterAvailableSlots(candidates, busy);

  return {
    slots,
    workWindow: workMinuteWindow,
    busy: busyBlocks,
    calendarTimezone: BOOKING_TIMEZONE,
    displayStartHour: DISPLAY_START_HOUR,
    displayEndHour: DISPLAY_END_HOUR,
  };
}

export async function getAvailableSlotsForDay(dateStr: string): Promise<TimeSlot[]> {
  const p = await getAvailabilityDayPayload(dateStr);
  return p.slots;
}
