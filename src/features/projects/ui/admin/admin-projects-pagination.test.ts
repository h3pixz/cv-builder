import { describe, expect, it } from "vitest";

import { getProjectsPageHref } from "./admin-projects-pagination";

describe("getProjectsPageHref", () => {
  it("keeps the search and sort when changing the page", () => {
    expect(
      getProjectsPageHref({
        search: "cv",
        sortBy: "start_date",
        sortOrder: "desc",
        page: 3,
      }),
    ).toBe(
      "/admin/projects?search=cv&sort_by=start_date&sort_order=desc&page=3",
    );
  });

  it("omits the page for the first page and skips empty filters", () => {
    expect(
      getProjectsPageHref({
        search: "",
        sortBy: undefined,
        sortOrder: undefined,
        page: 1,
      }),
    ).toBe("/admin/projects");
  });
});
