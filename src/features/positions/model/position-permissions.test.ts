import { describe, expect, it } from "vitest";

import { canManagePositionCatalog } from "./position-permissions";

describe("canManagePositionCatalog", () => {
  it("allows admins", () => {
    expect(canManagePositionCatalog("Admin")).toBe(true);
  });

  it("forbids employees and unknown roles", () => {
    expect(canManagePositionCatalog("Employee")).toBe(false);
    expect(canManagePositionCatalog(null)).toBe(false);
    expect(canManagePositionCatalog(undefined)).toBe(false);
  });
});
