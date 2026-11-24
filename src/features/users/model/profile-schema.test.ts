import { describe, expect, it } from "vitest";

import { profileSchema } from "./profile-schema";

const valid = {
  firstName: "Ada",
  lastName: "Lovelace",
  departmentId: "dep-1",
  positionId: "pos-1",
};

describe("profileSchema", () => {
  it("accepts a complete profile", () => {
    expect(profileSchema.parse(valid)).toEqual(valid);
  });

  it("trims names", () => {
    expect(
      profileSchema.parse({ ...valid, firstName: "  Ada  " }).firstName,
    ).toBe("Ada");
  });

  it("requires every field", () => {
    const result = profileSchema.safeParse({
      firstName: " ",
      lastName: "",
      departmentId: "",
      positionId: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "First name is required",
      "Last name is required",
      "Department is required",
      "Position is required",
    ]);
  });

  it("limits names to 100 characters", () => {
    const result = profileSchema.safeParse({
      ...valid,
      firstName: "a".repeat(101),
      lastName: "a".repeat(101),
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "First name must be 100 characters or fewer",
      "Last name must be 100 characters or fewer",
    ]);
  });
});
