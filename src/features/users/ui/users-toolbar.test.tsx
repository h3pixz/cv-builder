import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

let currentParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => "/users",
  useRouter: () => ({ replace }),
  useSearchParams: () => currentParams,
}));

import { UsersToolbar } from "./users-toolbar";

function searchInput() {
  return screen.getByRole("textbox", { name: "Search users" });
}

function renderToolbar(initialSearch = "") {
  return render(
    <UsersToolbar
      initialSearch={initialSearch}
      canManage={false}
      departments={[]}
      positions={[]}
    />,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  replace.mockReset();
  currentParams = new URLSearchParams();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("UsersToolbar", () => {
  it("does not navigate on mount", () => {
    currentParams = new URLSearchParams("page=2");

    renderToolbar();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).not.toHaveBeenCalled();
  });

  it("does not reset the page when the URL changes without a search", () => {
    const { rerender } = renderToolbar();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    currentParams = new URLSearchParams("page=2");

    rerender(
      <UsersToolbar
        initialSearch=""
        canManage={false}
        departments={[]}
        positions={[]}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).not.toHaveBeenCalled();
  });

  it("navigates after the debounce and keeps the other params", () => {
    currentParams = new URLSearchParams(
      "sort_by=last_name&sort_order=desc&page=3",
    );

    renderToolbar();

    fireEvent.change(searchInput(), { target: { value: "  john doe  " } });

    expect(replace).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).toHaveBeenCalledWith(
      "/users?sort_by=last_name&sort_order=desc&search=john+doe",
    );
  });

  it("drops the query parameter when the search is cleared", () => {
    currentParams = new URLSearchParams("search=alice&page=2");

    renderToolbar("alice");

    fireEvent.change(searchInput(), { target: { value: "   " } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).toHaveBeenCalledWith("/users");
  });

  it("follows an external search change without pushing it back", () => {
    currentParams = new URLSearchParams("search=alice");

    const { rerender } = renderToolbar("alice");

    currentParams = new URLSearchParams();

    rerender(
      <UsersToolbar
        initialSearch=""
        canManage={false}
        departments={[]}
        positions={[]}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(searchInput()).toHaveValue("");
    expect(replace).not.toHaveBeenCalled();
  });
});
