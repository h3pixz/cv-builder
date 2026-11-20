import { describe, expect, it } from "vitest";

import {
  SKILL_MESSAGES,
  SKILL_NAME_MAX,
  addMySkillSchema,
  catalogSkillSchema,
  skillFormSchema,
  updateMySkillSchema,
} from "./skill-schema";

describe("skillFormSchema", () => {
  it("accepts a filled form", () => {
    expect(
      skillFormSchema.safeParse({ name: "React", mastery: "Expert" }).success,
    ).toBe(true);
  });

  it("requires the skill and its mastery", () => {
    const result = skillFormSchema.safeParse({ name: " ", mastery: "" });

    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      SKILL_MESSAGES.nameRequired,
      SKILL_MESSAGES.masteryRequired,
    ]);
  });
});

describe("addMySkillSchema", () => {
  it("trims the name and accepts the optional category", () => {
    const parsed = addMySkillSchema.parse({
      name: "  React  ",
      mastery: "Expert",
      categoryId: "frontend",
    });

    expect(parsed).toEqual({
      name: "React",
      mastery: "Expert",
      categoryId: "frontend",
    });
  });

  it("rejects a mastery outside the backend enum", () => {
    const result = addMySkillSchema.safeParse({
      name: "React",
      mastery: "Godlike",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      SKILL_MESSAGES.masteryRequired,
    );
  });
});

describe("updateMySkillSchema", () => {
  it("does not accept a category change", () => {
    const parsed = updateMySkillSchema.parse({
      name: "React",
      mastery: "Advanced",
      categoryId: "backend",
    });

    expect(parsed).toEqual({ name: "React", mastery: "Advanced" });
  });
});

describe("catalogSkillSchema", () => {
  it("accepts a name and a category", () => {
    expect(
      catalogSkillSchema.safeParse({ name: "React", categoryId: "frontend" })
        .success,
    ).toBe(true);
  });

  it("requires both fields", () => {
    const result = catalogSkillSchema.safeParse({ name: "", categoryId: "" });

    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      SKILL_MESSAGES.nameRequired,
      SKILL_MESSAGES.categoryRequired,
    ]);
  });

  it("limits the name length", () => {
    const result = catalogSkillSchema.safeParse({
      name: "a".repeat(SKILL_NAME_MAX + 1),
      categoryId: "frontend",
    });

    expect(result.error?.issues[0]?.message).toBe(SKILL_MESSAGES.nameTooLong);
  });
});
