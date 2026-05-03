"use client";

import { AnimatePresence, motion } from "framer-motion";
import { toDate } from "date-fns-tz";
import { useState } from "react";

import { BOOKING_TIMEZONE } from "@/app/lib/booking/config";
import type { TimeSlot } from "@/app/lib/booking/types";

import { BookingError } from "./BookingError";
import { BookingSuccess } from "./BookingSuccess";
import { BookingSummary } from "./BookingSummary";
import type { ContactFields } from "./ContactFormStep";
import { ContactFormStep } from "./ContactFormStep";
import { DateAndTimeStep } from "./DateAndTimeStep";

const STEPS = ["Datum a čas", "Kontakt", "Souhrn"] as const;

const BENEFITS = [
  "30 minut bez závazku",
  "Online nebo osobně podle domluvy",
  "Jasné doporučení dalšího postupu",
  "Bez zbytečného papírování",
] as const;

function formatLongDate(ymd: string): string {
  const d = toDate(`${ymd}T12:00:00`, { timeZone: BOOKING_TIMEZONE });
  return new Intl.DateTimeFormat("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function BookingSection() {
  const [step, setStep] = useState(0);
  const [dateStr, setDateStr] = useState<string | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [contact, setContact] = useState<ContactFields>({
    name: "",
    email: "",
    phone: "",
    message: "",
    gdprConsent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    reservation: {
      date: string;
      timeLabel: string;
      name: string;
      email: string;
      reasonPreview: string;
    };
  } | null>(null);

  const canNextFromDateTime = Boolean(dateStr && slot);

  const canNextFromContact =
    contact.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()) &&
    contact.phone.trim().length >= 5 &&
    contact.message.trim().length >= 10 &&
    contact.gdprConsent;

  function goNext() {
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submitBooking() {
    if (!dateStr || !slot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          startTime: slot.start,
          name: contact.name.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          message: contact.message.trim(),
          gdprConsent: true as const,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        diagnostic?: string;
        reservation?: {
          date: string;
          timeLabel: string;
          name: string;
          email: string;
          reasonPreview: string;
        };
      };
      if (res.status === 409) {
        setError(data.error ?? "Tenhle termín už bohužel není dostupný. Vyberte prosím jiný čas.");
        return;
      }
      if (!res.ok) {
        const base =
          data.error ??
          "Rezervaci se teď nepodařilo dokončit. Zkuste to prosím znovu za chvíli nebo nás kontaktujte přímo.";
        setError(data.diagnostic ? `${base}\n\nDiagnostika: ${data.diagnostic}` : base);
        return;
      }
      if (data.reservation) {
        setSuccess({ reservation: data.reservation });
      }
    } catch {
      setError(
        "Rezervaci se teď nepodařilo dokončit. Zkuste to prosím znovu za chvíli nebo nás kontaktujte přímo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <BookingSuccess reservation={success.reservation} dateDisplay={formatLongDate(success.reservation.date)} />
    );
  }

  return (
    <div className="booking-panel">
      <h3 className="text-3xl font-bold text-foreground">Domluvte si nezávaznou konzultaci</h3>
      <p className="mt-2 max-w-[62ch] text-muted">
        Vyberte si termín, který vám vyhovuje. Schůzku vám následně potvrdíme do kalendáře.
      </p>
      <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
        {BENEFITS.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-primary" aria-hidden>
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>

      <nav className="mt-8 flex flex-wrap items-center gap-2" aria-label="Postup rezervace">
        {STEPS.map((label, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                  active
                    ? "border-[rgba(5,150,105,0.55)] bg-[rgba(209,250,229,0.85)] text-[var(--primary-deep)]"
                    : done
                      ? "border-[rgba(5,150,105,0.35)] bg-white text-primary"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span className={`text-sm ${active ? "font-semibold text-foreground" : "text-muted"}`}>{label}</span>
              {i < STEPS.length - 1 ? <span className="mx-1 text-muted hidden sm:inline">→</span> : null}
            </div>
          );
        })}
      </nav>

      <div className="mt-8 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 ? (
              <DateAndTimeStep
                dateStr={dateStr}
                onDateChange={setDateStr}
                slot={slot}
                onSlotChange={setSlot}
              />
            ) : null}
            {step === 1 ? (
              <ContactFormStep {...contact} onChange={(patch) => setContact((c) => ({ ...c, ...patch }))} />
            ) : null}
            {step === 2 && dateStr && slot ? (
              <div className="space-y-4">
                {error ? <BookingError message={error} /> : null}
                <BookingSummary dateLabel={formatLongDate(dateStr)} slot={slot} contact={contact} />
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {step > 0 ? (
          <button type="button" className="btn-secondary" onClick={goBack}>
            Zpět
          </button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            className="btn-primary"
            disabled={
              (step === 0 && !canNextFromDateTime) || (step === 1 && !canNextFromContact)
            }
            onClick={goNext}
          >
            Pokračovat
          </button>
        ) : (
          <button type="button" className="btn-primary" disabled={submitting} onClick={() => void submitBooking()}>
            {submitting ? "Odesílám…" : "Potvrdit rezervaci"}
          </button>
        )}
      </div>
    </div>
  );
}
