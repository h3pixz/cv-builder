import { act, renderHook } from "@testing-library/react";
import { useOnlineStatus } from "./use-online-status";

describe("useOnlineStatus", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true when the browser is online", () => {
    vi.spyOn(Navigator.prototype, "onLine", "get").mockReturnValue(true);

    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(true);
  });

  it("reacts to offline and online events", () => {
    const onLine = vi
      .spyOn(Navigator.prototype, "onLine", "get")
      .mockReturnValue(false);

    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(false);

    onLine.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(true);
  });
});
