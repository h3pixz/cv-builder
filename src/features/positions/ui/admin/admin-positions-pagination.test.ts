import { describe, expect, it } from "vitest";

import { getPositionsPageHref } from "./admin-positions-pagination";

describe("getPositionsPageHref", () => {
  it("keeps the search and sort when changing the page", () => {
    expect(
      getPositionsPageHref({
        search: "developer",
        sortBy: "name",
        sortOrder: "desc",
        page: 3,
      }),
    ).toBe(
      "/admin/positions?search=developer&sort_by=name&sort_order=desc&page=3",
    );
  });

  it("omits the page for the first page and skips empty filters", () => {
    expect(
      getPositionsPageHref({
        search: "",
        sortBy: undefined,
        sortOrder: undefined,
        page: 1,
      }),
    ).toBe("/admin/positions");
  });
});
