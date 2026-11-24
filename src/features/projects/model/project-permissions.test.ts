import { describe, expect, it } from "vitest";

import { canManageProjectCatalog } from "./project-permissions";

describe("canManageProjectCatalog", () => {
  it("allows admins", () => {
    expect(canManageProjectCatalog("Admin")).toBe(true);
  });

  it("forbids employees and unknown roles", () => {
    expect(canManageProjectCatalog("Employee")).toBe(false);
    expect(canManageProjectCatalog(null)).toBe(false);
    expect(canManageProjectCatalog(undefined)).toBe(false);
  });
});
