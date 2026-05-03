"use client";

type BookingErrorProps = {
  message: string;
};

export function BookingError({ message }: BookingErrorProps) {
  return (
    <div
      className="rounded-[14px] border border-red-200 bg-red-50/90 px-4 py-3 text-sm whitespace-pre-wrap text-red-900"
      role="alert"
    >
      {message}
    </div>
  );
}
