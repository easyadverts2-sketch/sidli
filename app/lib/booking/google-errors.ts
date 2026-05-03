/**
 * Safe one-line diagnostic for Google API / Gaxios failures (no secrets).
 * Used in API JSON so Vercel logs + browser Network can be compared.
 */
export function formatGoogleApiError(e: unknown): string {
  if (e == null) return "unknown_error";
  if (typeof e !== "object") return String(e);

  const o = e as {
    message?: string;
    code?: string | number;
    errors?: Array<{ message?: string; reason?: string }>;
    response?: { status?: number; statusText?: string; data?: unknown };
  };

  const parts: string[] = [];
  if (o.response?.status != null) parts.push(`status=${o.response.status}`);
  if (o.response?.statusText) parts.push(o.response.statusText);
  if (o.message) parts.push(o.message);
  if (Array.isArray(o.errors) && o.errors.length) {
    parts.push(o.errors.map((x) => x.reason ?? x.message ?? "").filter(Boolean).join(","));
  }
  if (o.response?.data != null) {
    try {
      const s = JSON.stringify(o.response.data);
      parts.push(s.length > 400 ? `${s.slice(0, 400)}…` : s);
    } catch {
      parts.push("[unserializable response.data]");
    }
  }
  const out = parts.filter(Boolean).join(" | ");
  return out.length > 900 ? `${out.slice(0, 900)}…` : out;
}
