import { describe, expect, it } from "vitest";

import { getUsersPageHref } from "./users-pagination";

describe("getUsersPageHref", () => {
  it("points to a bare /users for the first page without filters", () => {
    expect(getUsersPageHref({ page: 1 })).toBe("/users");
  });

  it("adds the page for later pages", () => {
    expect(getUsersPageHref({ page: 3 })).toBe("/users?page=3");
  });

  it("keeps the search filter and sort order", () => {
    expect(
      getUsersPageHref({
        page: 2,
        search: "john doe",
        sortBy: "last_name",
        sortOrder: "desc",
      }),
    ).toBe("/users?search=john+doe&sort_by=last_name&sort_order=desc&page=2");
  });
});
