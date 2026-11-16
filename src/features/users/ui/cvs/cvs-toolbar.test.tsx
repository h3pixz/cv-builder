import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/users/user-1/cvs",
  useRouter: () => ({ replace }),
}));

import { CvsToolbar } from "./cvs-toolbar";

function searchInput() {
  return screen.getByRole("textbox", { name: "Search CVs" });
}

beforeEach(() => {
  vi.useFakeTimers();
  replace.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("CvsToolbar", () => {
  it("renders the initial search and a disabled create button", () => {
    render(<CvsToolbar initialSearch="alice" />);

    expect(searchInput()).toHaveValue("alice");
    expect(screen.getByRole("button", { name: /create cv/i })).toBeDisabled();
  });

  it("does not navigate on mount", () => {
    render(<CvsToolbar initialSearch="" />);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).not.toHaveBeenCalled();
  });

  it("navigates after the debounce with an encoded search", () => {
    render(<CvsToolbar initialSearch="" />);

    fireEvent.change(searchInput(), { target: { value: "  john doe  " } });

    expect(replace).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).toHaveBeenCalledWith("/users/user-1/cvs?search=john%20doe");
  });

  it("drops the query parameter when the search is cleared", () => {
    render(<CvsToolbar initialSearch="alice" />);

    fireEvent.change(searchInput(), { target: { value: "   " } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replace).toHaveBeenCalledWith("/users/user-1/cvs");
  });
});
