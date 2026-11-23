import { describe, expect, it } from "vitest";

import {
  DEPARTMENT_MESSAGES,
  DEPARTMENT_NAME_MAX,
  catalogDepartmentSchema,
} from "./department-schema";

describe("catalogDepartmentSchema", () => {
  it("accepts a department name and trims it", () => {
    const parsed = catalogDepartmentSchema.parse({ name: "  Engineering  " });

    expect(parsed).toEqual({ name: "Engineering" });
  });

  it("requires the department name", () => {
    const result = catalogDepartmentSchema.safeParse({ name: "   " });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      DEPARTMENT_MESSAGES.nameRequired,
    );
  });

  it("limits the name length", () => {
    const result = catalogDepartmentSchema.safeParse({
      name: "a".repeat(DEPARTMENT_NAME_MAX + 1),
    });

    expect(result.error?.issues[0]?.message).toBe(
      DEPARTMENT_MESSAGES.nameTooLong,
    );
  });
});
