import { describe, expect, it } from "vitest";

import { canManageDepartmentCatalog } from "./department-permissions";

describe("canManageDepartmentCatalog", () => {
  it("allows admins", () => {
    expect(canManageDepartmentCatalog("Admin")).toBe(true);
  });

  it("forbids employees and unknown roles", () => {
    expect(canManageDepartmentCatalog("Employee")).toBe(false);
    expect(canManageDepartmentCatalog(null)).toBe(false);
    expect(canManageDepartmentCatalog(undefined)).toBe(false);
  });
});
