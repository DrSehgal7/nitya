const DAY_MS = 86_400_000;

export function indiaDateKey(now = Date.now()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function indiaDateStart(date: string): number {
  return new Date(`${date}T00:00:00+05:30`).getTime();
}

export function daysUntilIndiaDate(date: string, now = Date.now()): number {
  const today = indiaDateStart(indiaDateKey(now));
  return Math.max(0, Math.round((indiaDateStart(date) - today) / DAY_MS));
}

export function nextDatedItemIndex<T extends { date: string }>(
  items: T[],
  now = Date.now(),
): number {
  if (items.length === 0) return -1;
  const today = indiaDateKey(now);
  const index = items.findIndex(({ date }) => date >= today);
  return index === -1 ? items.length - 1 : index;
}
