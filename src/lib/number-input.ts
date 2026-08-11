export function parseNumberDraft(
  draft: string,
  { min, max }: { min?: number; max?: number } = {},
): number | null {
  if (draft.trim() === "") return null;
  const value = Number(draft);
  if (!Number.isFinite(value)) return null;
  if (min !== undefined && value < min) return null;
  if (max !== undefined && value > max) return null;
  return value;
}
