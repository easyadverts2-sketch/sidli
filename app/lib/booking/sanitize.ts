/** Strip control chars and angle brackets for safe Calendar description text. */
export function sanitizeCalendarText(input: string, maxLen = 4000): string {
  return input
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f<>]/g, "")
    .slice(0, maxLen)
    .trim();
}
