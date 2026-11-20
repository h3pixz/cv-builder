import { describe, expect, it } from "vitest";

import { PROFICIENCY_MAX, proficiencyLevel } from "./levels";

describe("proficiencyLevel", () => {
  it.each([
    ["A1", 1],
    ["A2", 2],
    ["B1", 3],
    ["B2", 4],
    ["C1", 5],
    ["C2", 6],
    ["Native", 7],
  ])("maps %s to %i", (value, expected) => {
    expect(proficiencyLevel(value)).toBe(expected);
  });

  it("returns 0 for an unknown proficiency", () => {
    expect(proficiencyLevel("unknown")).toBe(0);
  });

  it("matches the number of proficiency levels", () => {
    expect(PROFICIENCY_MAX).toBe(7);
  });
});
