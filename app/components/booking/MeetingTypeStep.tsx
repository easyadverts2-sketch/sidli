"use client";

import type { MeetingTypeDefinition, MeetingTypeId } from "@/app/lib/booking/types";

type MeetingTypeStepProps = {
  types: MeetingTypeDefinition[];
  selectedId: string | null;
  onSelect: (id: MeetingTypeId) => void;
};

export function MeetingTypeStep({ types, selectedId, onSelect }: MeetingTypeStepProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {types.map((m) => {
        const active = selectedId === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className={`service-panel text-left transition-shadow ${
              active ? "ring-2 ring-[rgba(5,150,105,0.45)]" : "hover:border-[rgba(5,150,105,0.35)]"
            }`}
          >
            <span className="service-icon text-lg" aria-hidden>
              {m.icon}
            </span>
            <h4 className="mb-1 text-lg font-semibold text-primary">{m.label}</h4>
            <p className="text-sm text-muted">{m.description}</p>
            <p className="mt-2 text-xs font-medium text-foreground/80">{m.durationMinutes} minut</p>
          </button>
        );
      })}
    </div>
  );
}
