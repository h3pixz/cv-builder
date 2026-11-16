import { describe, expect, it } from "vitest";
import {
  MASTERY_MAX,
  PROFICIENCY_MAX,
  groupSkills,
  masteryLevel,
  proficiencyLevel,
} from "./levels";

describe("masteryLevel", () => {
  it.each([
    ["Novice", 1],
    ["Advanced", 2],
    ["Competent", 3],
    ["Proficient", 4],
    ["Expert", 5],
  ])("maps %s to %i", (value, expected) => {
    expect(masteryLevel(value)).toBe(expected);
  });

  it("returns 0 for an unknown mastery", () => {
    expect(masteryLevel("unknown")).toBe(0);
  });

  it("matches the number of mastery levels", () => {
    expect(MASTERY_MAX).toBe(5);
  });
});

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

describe("groupSkills", () => {
  const categories = [
    {
      id: "frontend",
      name: "Frontend",
      order: 1,
      children: [{ id: "react", name: "React", order: 2 }],
    },
    { id: "backend", name: "Backend", order: 2, children: [] },
  ];

  it("groups skills by their category, including child categories", () => {
    const groups = groupSkills(
      [
        { name: "TypeScript", categoryId: "frontend", mastery: "Expert" },
        { name: "Hooks", categoryId: "react", mastery: "Proficient" },
        { name: "Node", categoryId: "backend", mastery: "Advanced" },
      ],
      categories,
    );

    expect(groups.map((group) => group.name)).toEqual([
      "Frontend",
      "Backend",
      "React",
    ]);
    expect(groups.map((group) => group.skills.map((s) => s.name))).toEqual([
      ["TypeScript"],
      ["Node"],
      ["Hooks"],
    ]);
  });

  it("sorts groups by order and then by name", () => {
    const groups = groupSkills(
      [
        { name: "Node", categoryId: "backend", mastery: "Advanced" },
        { name: "Hooks", categoryId: "react", mastery: "Proficient" },
      ],
      categories,
    );

    // Backend and React share order 2, so the name breaks the tie.
    expect(groups.map((group) => group.name)).toEqual(["Backend", "React"]);
  });

  it("puts skills without a category into an Other group at the end", () => {
    const groups = groupSkills(
      [
        { name: "Uncategorized", mastery: "Competent" },
        { name: "TypeScript", categoryId: "frontend", mastery: "Expert" },
      ],
      categories,
    );

    expect(groups.map((group) => group.name)).toEqual(["Frontend", "Other"]);
    expect(groups[1].skills.map((skill) => skill.name)).toEqual([
      "Uncategorized",
    ]);
  });

  it("falls back to Other for an unknown category id", () => {
    const [group] = groupSkills(
      [{ name: "Mystery", categoryId: "missing", mastery: "Novice" }],
      categories,
    );

    expect(group.name).toBe("Other");
    expect(group.order).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("keeps the order of skills within a group", () => {
    const [group] = groupSkills(
      [
        { name: "First", categoryId: "backend", mastery: "Novice" },
        { name: "Second", categoryId: "backend", mastery: "Expert" },
      ],
      categories,
    );

    expect(group.skills.map((skill) => skill.name)).toEqual([
      "First",
      "Second",
    ]);
  });

  it("returns an empty list when there are no skills", () => {
    expect(groupSkills([], categories)).toEqual([]);
  });
});
