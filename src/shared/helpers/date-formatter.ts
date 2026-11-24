export const formatDate = (timestamp: number | string) => {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(new Date(Number(timestamp)));
};

/**
 * Formats a date-only value (`YYYY-MM-DD`) or a timestamp as MM/DD/YYYY.
 * Dates are pinned to UTC so a date-only value never shifts to another day.
 */
export const formatDateOnly = (
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined || value === "") return "";

  const date =
    typeof value === "number" || /^\d+$/.test(value)
      ? new Date(Number(value))
      : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};
