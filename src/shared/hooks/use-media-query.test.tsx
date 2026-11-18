import { act, renderHook } from "@testing-library/react";
import { useMediaQuery } from "./use-media-query";

describe("useMediaQuery", () => {
  let matches = false;
  let listeners: Array<() => void> = [];

  beforeEach(() => {
    matches = false;
    listeners = [];

    vi.stubGlobal(
      "matchMedia",
      vi.fn(
        (query: string) =>
          ({
            matches,
            media: query,
            onchange: null,
            addEventListener: (_event: string, listener: () => void) => {
              listeners.push(listener);
            },
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as unknown as MediaQueryList,
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when the query does not match", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));

    expect(result.current).toBe(false);
  });

  it("returns true when the query matches", () => {
    matches = true;

    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));

    expect(result.current).toBe(true);
  });

  it("reacts to media query changes", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));

    expect(result.current).toBe(false);

    matches = true;
    act(() => {
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe(true);
  });
});
