import { describe, expect, it } from "vitest";
import { toggleAccount, uniqueAccountIds } from "../src/lib/habit-join-state";

describe("habit participation", () => {
  it("collapses duplicate account identifiers before counting", () => {
    expect(uniqueAccountIds(["account-a", "account-a", "account-b"])).toEqual([
      "account-a",
      "account-b",
    ]);
  });

  it("joins on the first click and leaves on the second click", () => {
    const participants: string[] = [];
    expect(toggleAccount(participants, "account-a")).toBe(true);
    expect(participants).toEqual(["account-a"]);
    expect(toggleAccount(participants, "account-a")).toBe(false);
    expect(participants).toEqual([]);
  });
});
