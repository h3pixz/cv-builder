import { describe, expect, it } from "vitest";

import { getDepartmentsPageHref } from "./admin-departments-pagination";

describe("getDepartmentsPageHref", () => {
  it("keeps the search and sort when changing the page", () => {
    expect(
      getDepartmentsPageHref({
        search: "engineering",
        sortBy: "name",
        sortOrder: "desc",
        page: 3,
      }),
    ).toBe(
      "/admin/departments?search=engineering&sort_by=name&sort_order=desc&page=3",
    );
  });

  it("omits the page for the first page and skips empty filters", () => {
    expect(
      getDepartmentsPageHref({
        search: "",
        sortBy: undefined,
        sortOrder: undefined,
        page: 1,
      }),
    ).toBe("/admin/departments");
  });
});
