export type ProjectRecord = {
  id: string;
  name: string;
  domain: string;
  startDate: string;
  endDate: string | null;
  description: string;
  environment: string[];
};

/**
 * Native date inputs expect `YYYY-MM-DD`. The backend may return a date-only
 * value or a full timestamp, so keep the calendar part only.
 */
export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";

  return value.slice(0, 10);
}

// "2025-09-04" -> Date (local time). Empty or invalid -> undefined
export function parseDateInputValue(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

// Date -> "2025-09-04". undefined -> ""
// (don't use toISOString(): it shifts the day by timezone)
export function formatDateInputValue(date?: Date): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
