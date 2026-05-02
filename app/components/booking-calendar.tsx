"use client";

import { FormEvent, useMemo, useState } from "react";

const HOURS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function humanDate(date: Date) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    weekday: "short",
  }).format(date);
}

export function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [provider, setProvider] = useState<"google" | "microsoft">("google");
  const [status, setStatus] = useState<string>("");

  const dates = useMemo(() => {
    const result: Date[] = [];
    const now = new Date();
    for (let i = 1; i <= 14; i += 1) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const day = d.getDay();
      if (day !== 0 && day !== 6) result.push(d);
    }
    return result;
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("Odesílám...");
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        reason,
        date: selectedDate,
        time: selectedTime,
        provider,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? "Nepodařilo se odeslat rezervaci.");
      return;
    }
    setStatus("Rezervace byla uložena. Potvrdíme termín e-mailem.");
    setSelectedTime("");
    setReason("");
    setName("");
  }

  return (
    <div className="form-panel">
      <div>
        <h3 className="text-3xl font-bold text-foreground">Objednání schůzky</h3>
        <p className="mt-2 text-muted">
          Klikněte na datum a čas. Pak doplňte jméno a důvod schůzky.
        </p>
        <div className="booking-dates mt-5">
          {dates.map((date) => {
            const value = formatDate(date);
            return (
              <button
                type="button"
                key={value}
                className={`booking-chip ${selectedDate === value ? "active" : ""}`}
                onClick={() => {
                  setSelectedDate(value);
                  setSelectedTime("");
                }}
              >
                {humanDate(date)}
              </button>
            );
          })}
        </div>
        {selectedDate ? (
          <div className="booking-times mt-4">
            {HOURS.map((hour) => (
              <button
                type="button"
                key={hour}
                className={`booking-chip ${selectedTime === hour ? "active" : ""}`}
                onClick={() => setSelectedTime(hour)}
              >
                {hour}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <form className="mt-8" onSubmit={onSubmit}>
        <input
          className="form-field"
          placeholder="Jméno a příjmení"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <textarea
          className="form-field min-h-24"
          placeholder="Důvod schůzky"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          required
        />
        <select
          className="form-field"
          value={provider}
          onChange={(event) => setProvider(event.target.value as "google" | "microsoft")}
        >
          <option value="google">Google kalendář</option>
          <option value="microsoft">Microsoft kalendář</option>
        </select>
        <button type="submit" className="btn-primary" disabled={!selectedDate || !selectedTime}>
          Potvrdit rezervaci
        </button>
        <p className="mt-3 text-sm text-muted">{status}</p>
      </form>
    </div>
  );
}
