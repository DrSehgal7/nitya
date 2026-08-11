const DAY_MS = 86_400_000;
const INDIA_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function projectDaysSince(startedOn: string, now = Date.now()): number {
  const start = new Date(`${startedOn}T00:00:00+05:30`).getTime();
  return Math.max(0, Math.floor((now - start) / DAY_MS));
}

export function millisecondsUntilNextIndiaMidnight(now = Date.now()): number {
  const indiaTime = now + INDIA_OFFSET_MS;
  const nextMidnight = (Math.floor(indiaTime / DAY_MS) + 1) * DAY_MS - INDIA_OFFSET_MS;
  return Math.max(1, nextMidnight - now);
}
