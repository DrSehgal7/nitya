export function parseNumberDraft(
  draft: string,
  { min, max, integer }: { min?: number; max?: number; integer?: boolean } = {},
): number | null {
  if (draft.trim() === "") return null;
  const value = Number(draft);
  if (!Number.isFinite(value)) return null;
  if (integer && !Number.isInteger(value)) return null;
  if (min !== undefined && value < min) return null;
  if (max !== undefined && value > max) return null;
  return value;
}
