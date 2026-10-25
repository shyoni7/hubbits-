// Calendar dates are plain "YYYY-MM-DD" strings. Arithmetic runs in UTC so
// it never shifts with the server's own time zone.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDateString(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  return toUTC(value).toISOString().slice(0, 10) === value;
}

function toUTC(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(date: string, days: number): string {
  const d = toUTC(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Sunday ... 6 = Saturday. */
export function dayOfWeek(date: string): number {
  return toUTC(date).getUTCDay();
}

export function isValidTimeZone(tz: string | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Today's calendar date in the given IANA time zone (UTC if invalid). */
export function todayIn(timeZone: string | undefined, now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: isValidTimeZone(timeZone) ? timeZone : "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function formatDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(toUTC(date));
}
