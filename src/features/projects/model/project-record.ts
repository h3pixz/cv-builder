export type ProjectRecord = {
  id: string;
  name: string;
  domain: string;
  startDate: string;
  endDate: string | null;
  description: string;
  environment: string[];
};

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";

  return value.slice(0, 10);
}

export function parseDateInputValue(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function formatDateInputValue(date?: Date): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
