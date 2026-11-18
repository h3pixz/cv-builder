import { describe, expect, it } from "vitest";

import {
  addLanguageSchema,
  addSkillSchema,
  skillFormSchema,
  updateSkillSchema,
} from "./level-forms";

describe("skillFormSchema", () => {
  it("requires a skill and a mastery level", () => {
    const result = skillFormSchema.safeParse({ name: "  ", mastery: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Skill is required",
      "Skill mastery is required",
    ]);
  });

  it("accepts a trimmed name and a level", () => {
    const result = skillFormSchema.parse({ name: " Node ", mastery: "Expert" });

    expect(result.name).toBe("Node");
  });
});

describe("addSkillSchema", () => {
  it("rejects a mastery outside the backend enum", () => {
    const result = addSkillSchema.safeParse({
      name: "Node",
      mastery: "Beginner",
    });

    expect(result.success).toBe(false);
  });

  it("keeps an optional category", () => {
    const result = addSkillSchema.parse({
      name: "Node",
      mastery: "Expert",
      categoryId: "backend",
    });

    expect(result.categoryId).toBe("backend");
  });

  it("does not require a category on update", () => {
    const result = updateSkillSchema.safeParse({
      name: "Node",
      mastery: "Advanced",
    });

    expect(result.success).toBe(true);
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
});
