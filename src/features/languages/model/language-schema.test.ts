import { describe, expect, it } from "vitest";

import {
  LANGUAGE_ISO_MAX,
  LANGUAGE_MESSAGES,
  LANGUAGE_NAME_MAX,
  addMyLanguageSchema,
  catalogLanguageSchema,
  languageFormSchema,
  updateMyLanguageSchema,
} from "./language-schema";

describe("languageFormSchema", () => {
  it("accepts a filled form", () => {
    expect(
      languageFormSchema.safeParse({ name: "English", mastery: "B2" }).success,
    ).toBe(true);
  });

  it("requires the language and its proficiency", () => {
    const result = languageFormSchema.safeParse({ name: " ", mastery: "" });

    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      LANGUAGE_MESSAGES.nameRequired,
      LANGUAGE_MESSAGES.proficiencyRequired,
    ]);
  });
});

describe("addMyLanguageSchema", () => {
  it("trims the name", () => {
    const parsed = addMyLanguageSchema.parse({
      name: "  English  ",
      mastery: "Native",
    });

    expect(parsed).toEqual({ name: "English", mastery: "Native" });
  });

  it("rejects a proficiency outside the backend enum", () => {
    const result = addMyLanguageSchema.safeParse({
      name: "English",
      mastery: "Fluent",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      LANGUAGE_MESSAGES.proficiencyRequired,
    );
  });
});

describe("updateMyLanguageSchema", () => {
  it("only carries the name and the proficiency", () => {
    const parsed = updateMyLanguageSchema.parse({
      name: "English",
      mastery: "C1",
      iso2: "EN",
    });

    expect(parsed).toEqual({ name: "English", mastery: "C1" });
  });
});

describe("catalogLanguageSchema", () => {
  it("accepts name, ISO and native name", () => {
    expect(
      catalogLanguageSchema.safeParse({
        name: "English",
        iso2: "EN",
        nativeName: "English",
      }).success,
    ).toBe(true);
  });

  it("requires every field", () => {
    const result = catalogLanguageSchema.safeParse({
      name: "",
      iso2: "",
      nativeName: "",
    });

    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      LANGUAGE_MESSAGES.catalogNameRequired,
      LANGUAGE_MESSAGES.isoRequired,
      LANGUAGE_MESSAGES.nativeNameRequired,
    ]);
  });

  it("limits the ISO code length", () => {
    const result = catalogLanguageSchema.safeParse({
      name: "English",
      iso2: "E".repeat(LANGUAGE_ISO_MAX + 1),
      nativeName: "English",
    });

    expect(result.error?.issues[0]?.message).toBe(LANGUAGE_MESSAGES.isoTooLong);
  });

  it("limits the name length", () => {
    const result = catalogLanguageSchema.safeParse({
      name: "a".repeat(LANGUAGE_NAME_MAX + 1),
      iso2: "EN",
      nativeName: "English",
    });

    expect(result.error?.issues[0]?.message).toBe(LANGUAGE_MESSAGES.nameTooLong);
  });
});
