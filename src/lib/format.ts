const indiaTimeZone = "Asia/Kolkata";

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: indiaTimeZone,
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: indiaTimeZone,
    timeZoneName: "short",
  }).format(new Date(value));
}

export function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function formatDistance(distanceKm: number): string {
  return `${distanceKm.toLocaleString("en-IN", {
    minimumFractionDigits: distanceKm < 10 ? 1 : 0,
    maximumFractionDigits: 2,
  })} km`;
}
