import { randomUUID } from "node:crypto";
import { formatInTimeZone } from "date-fns-tz";
import { google } from "googleapis";

import { BOOKING_TIMEZONE } from "./config";
import type { BusyInterval } from "./types";

/** Default redirect URI used when generating refresh tokens via OAuth Playground. */
const DEFAULT_OAUTH_REDIRECT = "https://developers.google.com/oauthplayground";

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI ?? DEFAULT_OAUTH_REDIRECT;
  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

export function isGoogleCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN,
  );
}

export function getCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
}

/**
 * Returns busy intervals from Google Calendar FreeBusy for the given half-open UTC range.
 * @param timeMin RFC3339
 * @param timeMax RFC3339
 */
export async function getBusyIntervals(timeMin: string, timeMax: string): Promise<BusyInterval[]> {
  const auth = getOAuthClient();
  if (!auth) {
    throw new Error("GOOGLE_CALENDAR_MISSING_CONFIG");
  }
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = getCalendarId();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
      timeZone: BOOKING_TIMEZONE,
    },
  });

  // Per-calendar errors (e.g. 403 hidden in 200 body) — see Calendar API freebusy response.
  const calEntry = res.data.calendars?.[calendarId];
  const fbErrors = calEntry?.errors;
  if (fbErrors?.length) {
    const detail = fbErrors.map((e) => `${e.domain ?? ""}:${e.reason ?? ""}`).join("; ");
    throw new Error(`FREEBUSY_CALENDAR_ERRORS:${detail}`);
  }

  const busy = calEntry?.busy ?? [];
  return busy
    .filter((b): b is { start?: string; end?: string } => Boolean(b.start && b.end))
    .map((b) => ({
      start: new Date(b.start as string),
      end: new Date(b.end as string),
    }));
}

export type CreateBookingEventInput = {
  summary: string;
  description: string;
  startIso: string;
  endIso: string;
  attendeeEmails: string[];
  /** When true, requests a Google Meet conference (requires conferenceDataVersion on insert). */
  createMeetLink: boolean;
};

/**
 * Creates a calendar event and sends invites to attendees (sendUpdates: all).
 * Meet link is optional via env BOOKING_CREATE_MEET_LINK / input flag.
 */
export async function createBookingEvent(input: CreateBookingEventInput): Promise<{ htmlLink?: string | null }> {
  const auth = getOAuthClient();
  if (!auth) {
    throw new Error("GOOGLE_CALENDAR_MISSING_CONFIG");
  }
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = getCalendarId();

  const conferenceData =
    input.createMeetLink && input.attendeeEmails.length > 0
      ? {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: { type: "hangoutsMeet" as const },
          },
        }
      : undefined;

  // Google expects wall-clock in timeZone; avoid passing raw UTC ISO with a TZ label.
  const startField = {
    dateTime: formatInTimeZone(new Date(input.startIso), BOOKING_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"),
    timeZone: BOOKING_TIMEZONE,
  };
  const endField = {
    dateTime: formatInTimeZone(new Date(input.endIso), BOOKING_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"),
    timeZone: BOOKING_TIMEZONE,
  };

  const res = await calendar.events.insert({
    calendarId,
    sendUpdates: "all",
    conferenceDataVersion: conferenceData ? 1 : undefined,
    requestBody: {
      summary: input.summary,
      description: input.description,
      start: startField,
      end: endField,
      attendees: input.attendeeEmails.map((email) => ({ email })),
      reminders: { useDefault: true },
      ...(conferenceData ? { conferenceData } : {}),
    },
  });

  return { htmlLink: res.data.htmlLink };
}
