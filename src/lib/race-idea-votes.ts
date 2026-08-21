export function uniqueVoterIds(voterIds: string[]): string[] {
  return [...new Set(voterIds)];
}

export function addVoterOnce(voterIds: string[], voterId: string): boolean {
  if (voterIds.includes(voterId)) return false;
  voterIds.push(voterId);
  return true;
}

export function toggleVoter(voterIds: string[], voterId: string): "added" | "removed" {
  const index = voterIds.indexOf(voterId);
  if (index >= 0) {
    voterIds.splice(index, 1);
    return "removed";
  }
  voterIds.push(voterId);
  return "added";
}
