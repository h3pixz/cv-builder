import { describe, expect, it } from "vitest";

import { canManageCvs } from "./cv-permissions";

describe("canManageCvs", () => {
  it("allows admins", () => {
    expect(canManageCvs("Admin")).toBe(true);
  });

  it("denies employees and unknown roles", () => {
    expect(canManageCvs("Employee")).toBe(false);
    expect(canManageCvs(null)).toBe(false);
    expect(canManageCvs(undefined)).toBe(false);
  });
});
