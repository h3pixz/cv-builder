import { describe, expect, it } from "vitest";

import { MASTERY_MAX, groupSkills, masteryLevel } from "./skill-levels";

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

describe("groupSkills", () => {
  const categories = [
    {
      id: "frontend",
      name: "Frontend",
      order: 1,
      children: [{ id: "react", name: "React", order: 2 }],
    },
    {
      id: "backend",
      name: "Backend",
      order: 2,
      children: [],
    },
  ];

  it("groups skills by category and skips empty categories", () => {
    const groups = groupSkills(
      [
        { name: "TypeScript", categoryId: "frontend", mastery: "Expert" },
        { name: "Node", categoryId: "backend", mastery: "Advanced" },
      ],
      categories,
    );

    expect(groups.map((group) => group.name)).toEqual(["Frontend", "Backend"]);
  });

  it("resolves child categories", () => {
    const groups = groupSkills(
      [{ name: "Hooks", categoryId: "react", mastery: "Proficient" }],
      categories,
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].name).toBe("React");
  });

  it("puts skills without a category into an Other group at the end", () => {
    const groups = groupSkills(
      [
        { name: "Mystery", mastery: "Novice" },
        { name: "TypeScript", categoryId: "frontend", mastery: "Expert" },
      ],
      categories,
    );

    expect(groups.map((group) => group.name)).toEqual(["Frontend", "Other"]);
    expect(groups[1].order).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("sorts groups by order and then by name", () => {
    const groups = groupSkills(
      [
        { name: "Node", categoryId: "backend", mastery: "Advanced" },
        { name: "Hooks", categoryId: "react", mastery: "Proficient" },
      ],
      categories,
    );

    expect(groups.map((group) => group.name)).toEqual(["Backend", "React"]);
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
