"use client";

import type { TimeSlot } from "@/app/lib/booking/types";

import { DateStep } from "./DateStep";
import { TimeSlotStep } from "./TimeSlotStep";

type DateAndTimeStepProps = {
  dateStr: string | null;
  onDateChange: (ymd: string) => void;
  slot: TimeSlot | null;
  onSlotChange: (s: TimeSlot | null) => void;
};

export function DateAndTimeStep({ dateStr, onDateChange, slot, onSlotChange }: DateAndTimeStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">1. Vyberte den</p>
        <DateStep
          value={dateStr}
          onChange={(d) => {
            onDateChange(d);
            onSlotChange(null);
          }}
        />
      </div>
      {dateStr ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">2. Vyberte čas v kalendáři</p>
          <TimeSlotStep date={dateStr} value={slot} onChange={onSlotChange} />
        </div>
      ) : (
        <p className="text-sm text-muted">Nejdřív zvolte den v řádku výše.</p>
      )}
    </div>
  );
}
