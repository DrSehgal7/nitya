import { describe, expect, it } from "vitest";
import { validateContactSubmission } from "../src/lib/contact-validation";

describe("contact submission validation", () => {
  it("requires only a name and note", () => {
    expect(validateContactSubmission({ name: "  Asha  ", note: "  Hello Hritik  " })).toEqual({
      ok: true,
      data: {
        name: "Asha",
        note: "Hello Hritik",
        email: null,
        instagram: null,
        interest: null,
      },
    });
  });

  it("rejects a missing name or note", () => {
    expect(validateContactSubmission({ name: "", note: "Hello" })).toMatchObject({ ok: false });
    expect(validateContactSubmission({ name: "Asha", note: "" })).toMatchObject({ ok: false });
  });

  it("validates email only when one is supplied", () => {
    expect(
      validateContactSubmission({ name: "Asha", note: "Hello", email: "not-an-email" }),
    ).toEqual({ ok: false, error: "Enter a valid email address or leave it blank." });
    expect(
      validateContactSubmission({
        name: "Asha",
        note: "Hello",
        email: "asha@example.com",
        instagram: "@asha_runs",
        interest: "Join a run",
      }),
    ).toMatchObject({
      ok: true,
      data: { email: "asha@example.com", instagram: "@asha_runs", interest: "Join a run" },
    });
  });
});
