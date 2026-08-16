import { describe, expect, it } from "vitest";
import { addVoterOnce, uniqueVoterIds } from "../src/lib/race-idea-votes";

describe("race idea voting", () => {
  it("deduplicates legacy repeated voter IDs", () => {
    expect(uniqueVoterIds(["account-a", "account-a", "account-b"])).toEqual([
      "account-a",
      "account-b",
    ]);
  });

  it("records at most one vote for the same account", () => {
    const voterIds = ["account-a"];
    expect(addVoterOnce(voterIds, "account-a")).toBe(false);
    expect(voterIds).toEqual(["account-a"]);
    expect(addVoterOnce(voterIds, "account-b")).toBe(true);
    expect(voterIds).toEqual(["account-a", "account-b"]);
  });
});
