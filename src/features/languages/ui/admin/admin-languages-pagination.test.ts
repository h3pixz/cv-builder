import { describe, expect, it } from "vitest";

import { getLanguagesPageHref } from "./admin-languages-pagination";

describe("getLanguagesPageHref", () => {
  it("keeps the search and sort when changing the page", () => {
    expect(
      getLanguagesPageHref({
        search: "english",
        sortBy: "iso2",
        sortOrder: "desc",
        page: 3,
      }),
    ).toBe(
      "/admin/languages?search=english&sort_by=iso2&sort_order=desc&page=3",
    );
  });

  it("omits the page for the first page and skips empty filters", () => {
    expect(
      getLanguagesPageHref({
        search: "",
        sortBy: undefined,
        sortOrder: undefined,
        page: 1,
      }),
    ).toBe("/admin/languages");
  });
});
