export type MeetingTypeId =
  | "introductory"
  | "mortgages"
  | "investments"
  | "insurance"
  | "loans"
  | "retirement";

export type MeetingTypeDefinition = {
  id: MeetingTypeId;
  label: string;
  durationMinutes: number;
  description: string;
  icon: string;
};

export type TimeSlot = {
  /** ISO 8601 UTC instant */
  start: string;
  /** ISO 8601 UTC instant */
  end: string;
  /** Short label in Europe/Prague, e.g. "09:00" */
  label: string;
};

export type BusyInterval = {
  start: Date;
  end: Date;
};

/** Minutes from midnight in BOOKING_TIMEZONE (same numbers as config work windows). */
export type WorkWindowDto = {
  startMinute: number;
  endMinute: number;
};

/** Busy block with buffer applied (for UI shading); ISO 8601 UTC. */
export type BusyBlockIso = {
  start: string;
  end: string;
};

/** GET /api/booking/availability — data for grid + Google-compatible busy shading. */
export type AvailabilityDayPayload = {
  slots: TimeSlot[];
  workWindow: WorkWindowDto | null;
  /** Busy intervals extended by buffer (matches slot filtering). */
  busy: BusyBlockIso[];
  /** IANA TZ used for labels and server logic (always align with Google event TZ). */
  calendarTimezone: string;
  /** Top of day grid in Prague (hour 0–23). */
  displayStartHour: number;
  displayEndHour: number;
};
