export function uniqueAccountIds(accountIds: string[]): string[] {
  return [...new Set(accountIds)];
}

export function toggleAccount(accountIds: string[], accountId: string): boolean {
  const existingIndex = accountIds.indexOf(accountId);
  if (existingIndex >= 0) {
    accountIds.splice(existingIndex, 1);
    return false;
  }
  accountIds.push(accountId);
  return true;
}
