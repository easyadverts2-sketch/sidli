import type { MeetingTypeDefinition, MeetingTypeId } from "./types";

/** IANA timezone for booking rules and Google Calendar event walls. */
export const BOOKING_TIMEZONE = process.env.GOOGLE_TIMEZONE ?? "Europe/Prague";

/** Minutes between candidate slot start times within a workday. */
export const SLOT_GRID_MINUTES = 15;

/** Buffer after each existing calendar block (and after new bookings) in minutes. */
export const BUFFER_AFTER_MEETING_MINUTES = 15;

/** Minimum lead time before the first allowed slot. */
export const MIN_BOOKING_LEAD_HOURS = 24;

/** Maximum days ahead a date can be chosen. */
export const MAX_BOOKING_DAYS_AHEAD = 45;

/** Veřejná rezervace bez výběru typu — délka slotu v minutách (shoda s úvodní konzultací). */
export const BOOKING_SLOT_DURATION_MINUTES = 30;

/** Krátký název do Google Calendar (summary) a do UI. */
export const BOOKING_EVENT_LABEL = "Konzultace";

export const MEETING_TYPES: MeetingTypeDefinition[] = [
  {
    id: "introductory",
    label: "Úvodní konzultace",
    durationMinutes: 30,
    description: "Seznámení s vaší situací a základní orientace v dalších krocích.",
    icon: "☕",
  },
  {
    id: "mortgages",
    label: "Hypotéky",
    durationMinutes: 60,
    description: "Nabídky bank, parametry úvěru a průběh celého procesu.",
    icon: "⌂",
  },
  {
    id: "investments",
    label: "Investice",
    durationMinutes: 60,
    description: "Strategie, rizika a dlouhodobý plán investování.",
    icon: "↗",
  },
  {
    id: "insurance",
    label: "Pojištění",
    durationMinutes: 45,
    description: "Životní a neživotní krytí podle vašich priorit.",
    icon: "⚕",
  },
  {
    id: "loans",
    label: "Úvěry",
    durationMinutes: 45,
    description: "Spotřební úvěry, refinancování a konsolidace.",
    icon: "◈",
  },
  {
    id: "retirement",
    label: "Zajištění na důchod",
    durationMinutes: 60,
    description: "Dlouhodobé nastavení a revize stávajících produktů.",
    icon: "◔",
  },
];

const MEETING_IDS = new Set(MEETING_TYPES.map((m) => m.id));

export function isMeetingTypeId(value: string): value is MeetingTypeId {
  return MEETING_IDS.has(value as MeetingTypeId);
}

export function getMeetingTypeById(id: string): MeetingTypeDefinition | undefined {
  return MEETING_TYPES.find((m) => m.id === id);
}

/**
 * Work windows in Europe/Prague wall time.
 * @param isoWeekday ISO weekday from date-fns token `i`: 1 = Monday … 7 = Sunday.
 */
export function getWorkWindowMinutesForDay(isoWeekday: number): { start: number; end: number } | null {
  if (isoWeekday === 6 || isoWeekday === 7) return null;
  if (isoWeekday >= 1 && isoWeekday <= 4) {
    return { start: 9 * 60, end: 17 * 60 };
  }
  if (isoWeekday === 5) {
    return { start: 9 * 60, end: 14 * 60 };
  }
  return null;
}

/** Source line for calendar description footer. */
export const BOOKING_SOURCE_LINE = "Web Finance Šidlichovský";
