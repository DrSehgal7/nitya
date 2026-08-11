import { describe, expect, it } from "vitest";
import { parseNumberDraft } from "../src/lib/number-input";

describe("owner numeric drafts", () => {
  it("keeps an empty draft editable instead of converting it to zero", () => {
    expect(parseNumberDraft("", { min: 0 })).toBeNull();
    expect(parseNumberDraft("   ", { min: 0 })).toBeNull();
  });

  it("accepts valid integer and decimal replacements", () => {
    expect(parseNumberDraft("4200", { min: 0 })).toBe(4200);
    expect(parseNumberDraft("42.195", { min: 0.1 })).toBe(42.195);
  });

  it("rejects non-finite and out-of-range values", () => {
    expect(parseNumberDraft("-1", { min: 0 })).toBeNull();
    expect(parseNumberDraft("101", { min: 0, max: 100 })).toBeNull();
    expect(parseNumberDraft("Infinity")).toBeNull();
  });

  it("rejects fractions for whole-number fields", () => {
    expect(parseNumberDraft("1.5", { min: 0, integer: true })).toBeNull();
    expect(parseNumberDraft("2", { min: 0, integer: true })).toBe(2);
  });
});
