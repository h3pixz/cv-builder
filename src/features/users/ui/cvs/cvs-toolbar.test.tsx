import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

let currentParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => "/users/user-1/cvs",
  useRouter: () => ({ replace }),
  useSearchParams: () => currentParams,
}));

vi.mock("./cv-dialog", () => ({
  CvDialog: ({
    mode,
    userId,
    open,
  }: {
    mode: string;
    userId: string;
    open: boolean;
  }) =>
    open ? (
      <div>
        {mode} dialog for {userId}
      </div>
    ) : null,
}));

import { CvsToolbar } from "./cvs-toolbar";

function searchInput() {
  return screen.getByRole("textbox", { name: "Search CVs" });
}

function renderToolbar(initialSearch = "") {
  return render(<CvsToolbar userId="user-1" initialSearch={initialSearch} />);
}

beforeEach(() => {
  vi.useFakeTimers();
  replace.mockReset();
  currentParams = new URLSearchParams();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("CvsToolbar", () => {
  it("renders the initial search and an enabled create button", () => {
    renderToolbar("alice");

    expect(searchInput()).toHaveValue("alice");
    expect(
      screen.getByRole("button", { name: /create cv/i }),
    ).toBeEnabled();
  });

  it("opens the create CV dialog", () => {
    renderToolbar();

    fireEvent.click(screen.getByRole("button", { name: /create cv/i }));

    expect(screen.getByText("create dialog for user-1")).toBeInTheDocument();
  });

  it("does not navigate on mount", () => {
    renderToolbar();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).not.toHaveBeenCalled();
  });

  it("navigates after the debounce with an encoded search", () => {
    renderToolbar();

    fireEvent.change(searchInput(), { target: { value: "  john doe  " } });

    expect(replace).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).toHaveBeenCalledWith(
      "/users/user-1/cvs?search=john+doe",
    );
  });

  it("keeps the sort parameters when the search changes", () => {
    currentParams = new URLSearchParams("sort_by=name&sort_order=desc");

    renderToolbar();

    fireEvent.change(searchInput(), { target: { value: "alice" } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).toHaveBeenCalledWith(
      "/users/user-1/cvs?sort_by=name&sort_order=desc&search=alice",
    );
  });

  it("drops the query parameter when the search is cleared", () => {
    currentParams = new URLSearchParams("search=alice&sort_by=name");

    renderToolbar("alice");

    fireEvent.change(searchInput(), { target: { value: "   " } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).toHaveBeenCalledWith(
      "/users/user-1/cvs?sort_by=name",
    );
  });

  it("follows an external search change without pushing it back", () => {
    currentParams = new URLSearchParams("search=alice");

    const { rerender } = renderToolbar("alice");

    currentParams = new URLSearchParams();

    rerender(<CvsToolbar userId="user-1" initialSearch="" />);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(searchInput()).toHaveValue("");
    expect(replace).not.toHaveBeenCalled();
  });
});
