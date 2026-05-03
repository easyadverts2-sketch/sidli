"use client";

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  message: string;
  gdprConsent: boolean;
};

type ContactFormStepProps = ContactFields & {
  onChange: (patch: Partial<ContactFields>) => void;
};

export function ContactFormStep({
  name,
  email,
  phone,
  message,
  gdprConsent,
  onChange,
}: ContactFormStepProps) {
  return (
    <div className="form-panel space-y-1">
      <input
        className="form-field"
        placeholder="Jméno a příjmení"
        value={name}
        onChange={(e) => onChange({ name: e.target.value })}
        autoComplete="name"
        required
      />
      <input
        className="form-field"
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => onChange({ email: e.target.value })}
        autoComplete="email"
        required
      />
      <input
        className="form-field"
        type="tel"
        placeholder="Telefon"
        value={phone}
        onChange={(e) => onChange({ phone: e.target.value })}
        autoComplete="tel"
        required
      />
      <textarea
        className="form-field min-h-26"
        placeholder="Poznámka / s čím chcete pomoct"
        value={message}
        onChange={(e) => onChange({ message: e.target.value })}
      />
      <label className="mt-2 flex cursor-pointer items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 rounded border border-[var(--border)] accent-[var(--primary)]"
          checked={gdprConsent}
          onChange={(e) => onChange({ gdprConsent: e.target.checked })}
        />
        <span>Souhlasím se zpracováním osobních údajů za účelem sjednání schůzky.</span>
      </label>
    </div>
  );
}
