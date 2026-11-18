import { describe, expect, it } from "vitest";

import { CV_TEXT_MAX, cvSchema } from "./cv-schema";

const valid = {
  name: "Frontend CV",
  education: "BSUIR",
  description: "Built the design system.",
};

describe("cvSchema", () => {
  it("accepts a filled CV", () => {
    expect(cvSchema.safeParse(valid).success).toBe(true);
  });

  it("requires name, education and description", () => {
    const result = cvSchema.safeParse({
      name: " ",
      education: "",
      description: "   ",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Name is required",
      "Education is required",
      "Description is required",
    ]);
  });

  it("limits name and education to 255 characters", () => {
    const result = cvSchema.safeParse({
      ...valid,
      name: "a".repeat(CV_TEXT_MAX + 1),
      education: "b".repeat(CV_TEXT_MAX + 1),
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      `Name must be at most ${CV_TEXT_MAX} characters`,
      `Education must be at most ${CV_TEXT_MAX} characters`,
    ]);
  });

  it("trims values before validating", () => {
    const parsed = cvSchema.parse({
      name: "  Frontend CV  ",
      education: "  BSUIR  ",
      description: "  Built the design system.  ",
    });

    expect(parsed).toEqual(valid);
  });
});
