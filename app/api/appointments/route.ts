import { NextResponse } from "next/server";

type AppointmentPayload = {
  name: string;
  reason: string;
  date: string;
  time: string;
  provider: "google" | "microsoft";
};

function isValid(payload: AppointmentPayload) {
  return (
    Boolean(payload.name?.trim()) &&
    Boolean(payload.reason?.trim()) &&
    /^\d{4}-\d{2}-\d{2}$/.test(payload.date) &&
    /^\d{2}:\d{2}$/.test(payload.time)
  );
}

export async function POST(request: Request) {
  const payload = (await request.json()) as AppointmentPayload;
  if (!isValid(payload)) {
    return NextResponse.json({ error: "Neplatná data rezervace." }, { status: 400 });
  }

  const webhookUrl =
    payload.provider === "google"
      ? process.env.GOOGLE_CALENDAR_WEBHOOK_URL
      : process.env.MICROSOFT_CALENDAR_WEBHOOK_URL;

  // In-house scheduling endpoint; webhook integration is optional and can be enabled by env vars.
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  return NextResponse.json({ ok: true });
}
