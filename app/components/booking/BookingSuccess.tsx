"use client";

type Reservation = {
  meetingTypeLabel: string;
  date: string;
  timeLabel: string;
  name: string;
  email: string;
};

type BookingSuccessProps = {
  reservation: Reservation;
  dateDisplay: string;
};

export function BookingSuccess({ reservation, dateDisplay }: BookingSuccessProps) {
  return (
    <div className="booking-panel space-y-4">
      <h3 className="text-2xl font-bold text-foreground">Schůzka je rezervovaná</h3>
      <p className="text-muted">
        Potvrzení jsme vám odeslali do e-mailu. Termín najdete také v kalendářové pozvánce.
      </p>
      <ul className="space-y-2 text-sm text-muted">
        <li>
          <span className="font-semibold text-foreground">Typ: </span>
          {reservation.meetingTypeLabel}
        </li>
        <li>
          <span className="font-semibold text-foreground">Datum: </span>
          {dateDisplay}
        </li>
        <li>
          <span className="font-semibold text-foreground">Čas: </span>
          {reservation.timeLabel}
        </li>
        <li>
          <span className="font-semibold text-foreground">Jméno: </span>
          {reservation.name}
        </li>
        <li>
          <span className="font-semibold text-foreground">E-mail: </span>
          {reservation.email}
        </li>
      </ul>
    </div>
  );
}
