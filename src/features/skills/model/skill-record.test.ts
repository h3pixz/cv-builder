import { describe, expect, it } from "vitest";

import { flattenSkillCategories } from "./skill-record";

describe("flattenSkillCategories", () => {
  it("uses leaf categories and derives the type from the parent", () => {
    const options = flattenSkillCategories([
      {
        id: "languages",
        name: "Programming Languages",
        order: 1,
        children: [
          { id: "frontend", name: "Frontend", order: 2 },
          { id: "backend", name: "Backend", order: 1 },
        ],
      },
    ]);

    expect(options).toEqual([
      {
        value: "backend",
        label: "Programming Languages / Backend",
        typeName: "Programming Languages",
      },
      {
        value: "frontend",
        label: "Programming Languages / Frontend",
        typeName: "Programming Languages",
      },
    ]);
  });

  it("keeps categories without children as their own type", () => {
    const options = flattenSkillCategories([
      { id: "tools", name: "Tools", order: 1, children: [] },
    ]);

    expect(options).toEqual([
      { value: "tools", label: "Tools", typeName: "Tools" },
    ]);
  });

  it("sorts root categories by order", () => {
    const options = flattenSkillCategories([
      { id: "second", name: "Second", order: 2, children: [] },
      { id: "first", name: "First", order: 1, children: [] },
    ]);

    expect(options.map((option) => option.value)).toEqual(["first", "second"]);
  });

  it("returns an empty list without categories", () => {
    expect(flattenSkillCategories([])).toEqual([]);
  });

  it("deduplicates a category that is also listed at the root", () => {
    const options = flattenSkillCategories([
      {
        id: "frontend",
        name: "Frontend",
        order: 1,
        children: [{ id: "react", name: "React", order: 1 }],
      },
      { id: "react", name: "React", order: 2, children: [] },
    ]);

    expect(options).toEqual([
      { value: "react", label: "Frontend / React", typeName: "Frontend" },
    ]);
  });

  it("keeps the parent type when the root entry comes first", () => {
    const options = flattenSkillCategories([
      { id: "react", name: "React", order: 1, children: [] },
      {
        id: "frontend",
        name: "Frontend",
        order: 2,
        children: [{ id: "react", name: "React", order: 1 }],
      },
    ]);

    expect(options).toEqual([
      { value: "react", label: "Frontend / React", typeName: "Frontend" },
    ]);
  });

  it("deduplicates repeated categories", () => {
    const options = flattenSkillCategories([
      { id: "tools", name: "Tools", order: 1, children: [] },
      { id: "tools", name: "Tools", order: 1, children: [] },
    ]);

    expect(options).toHaveLength(1);
  });
});
