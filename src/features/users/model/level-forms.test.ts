import { describe, expect, it } from "vitest";

import {
  addLanguageSchema,
  languageFormSchema,
  updateLanguageSchema,
} from "./level-forms";

describe("languageFormSchema", () => {
  it("requires a language and a proficiency level", () => {
    const result = languageFormSchema.safeParse({ name: "  ", mastery: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Language is required",
      "Language proficiency is required",
    ]);
  });

  it("accepts a trimmed name and a level", () => {
    const result = languageFormSchema.parse({
      name: " German ",
      mastery: "B2",
    });

    expect(result.name).toBe("German");
  });
});

describe("addLanguageSchema", () => {
  it("requires a language and a proficiency level", () => {
    const result = addLanguageSchema.safeParse({ name: "", mastery: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Language is required",
      "Language proficiency is required",
    ]);
  });

  it("accepts every supported proficiency", () => {
    for (const mastery of ["A1", "A2", "B1", "B2", "C1", "C2", "Native"]) {
      expect(
        addLanguageSchema.safeParse({ name: "German", mastery }).success,
      ).toBe(true);
    }
  });

  it("rejects an unknown proficiency", () => {
    expect(
      addLanguageSchema.safeParse({ name: "German", mastery: "D1" }).success,
    ).toBe(false);
  });

  it("keeps the same rules on update", () => {
    expect(
      updateLanguageSchema.safeParse({ name: "German", mastery: "C1" }).success,
    ).toBe(true);
  });
});
