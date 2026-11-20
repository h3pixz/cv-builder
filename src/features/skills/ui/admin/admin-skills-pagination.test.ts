import { describe, expect, it } from "vitest";

import { getSkillsPageHref } from "./admin-skills-pagination";

describe("getSkillsPageHref", () => {
  it("keeps the search and sort when changing the page", () => {
    expect(
      getSkillsPageHref({
        search: "react",
        sortBy: "name",
        sortOrder: "desc",
        page: 3,
      }),
    ).toBe("/admin/skills?search=react&sort_by=name&sort_order=desc&page=3");
  });

  it("omits the page for the first page and skips empty filters", () => {
    expect(
      getSkillsPageHref({ search: "", sortBy: undefined, sortOrder: undefined, page: 1 }),
    ).toBe("/admin/skills");
  });
});
