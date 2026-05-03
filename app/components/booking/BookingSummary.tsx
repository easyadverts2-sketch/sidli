"use client";

import type { MeetingTypeDefinition } from "@/app/lib/booking/types";
import type { TimeSlot } from "@/app/lib/booking/types";

import type { ContactFields } from "./ContactFormStep";

type BookingSummaryProps = {
  meeting: MeetingTypeDefinition;
  dateLabel: string;
  slot: TimeSlot;
  contact: ContactFields;
};

export function BookingSummary({ meeting, dateLabel, slot, contact }: BookingSummaryProps) {
  return (
    <div className="booking-panel space-y-3 text-sm text-muted">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Typ schůzky</p>
        <p className="text-base font-semibold text-foreground">
          {meeting.icon} {meeting.label}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Termín</p>
        <p className="text-base font-semibold text-foreground">
          {dateLabel} v {slot.label}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Kontakt</p>
        <p className="text-foreground">{contact.name}</p>
        <p>{contact.email}</p>
        <p>{contact.phone}</p>
        {contact.message.trim() ? <p className="mt-1 whitespace-pre-wrap">{contact.message}</p> : null}
      </div>
    </div>
  );
}
