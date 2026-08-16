export function uniqueVoterIds(voterIds: string[]): string[] {
  return [...new Set(voterIds)];
}

export function addVoterOnce(voterIds: string[], voterId: string): boolean {
  if (voterIds.includes(voterId)) return false;
  voterIds.push(voterId);
  return true;
}
