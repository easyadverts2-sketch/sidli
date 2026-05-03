"use client";

import type { TimeSlot } from "@/app/lib/booking/types";

import type { ContactFields } from "./ContactFormStep";

type BookingSummaryProps = {
  dateLabel: string;
  slot: TimeSlot;
  contact: ContactFields;
};

export function BookingSummary({ dateLabel, slot, contact }: BookingSummaryProps) {
  return (
    <div className="booking-panel space-y-3 text-sm text-muted">
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
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Důvod schůzky</p>
        <p className="mt-1 whitespace-pre-wrap text-foreground">{contact.message}</p>
      </div>
    </div>
  );
}
