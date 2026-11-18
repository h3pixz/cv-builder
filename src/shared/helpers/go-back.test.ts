import { goBack } from "./go-back";

describe("goBack", () => {
  const historyLength = window.history.length;

  afterEach(() => {
    Object.defineProperty(window.history, "length", {
      configurable: true,
      value: historyLength,
    });
    vi.restoreAllMocks();
  });

  it("returns to the previous page when history has entries", () => {
    const back = vi
      .spyOn(window.history, "back")
      .mockImplementation(() => undefined);

    Object.defineProperty(window.history, "length", {
      configurable: true,
      value: 2,
    });

    expect(goBack()).toBe(true);
    expect(back).toHaveBeenCalledTimes(1);
  });

  it("reports no history when the current page is the first one", () => {
    const back = vi
      .spyOn(window.history, "back")
      .mockImplementation(() => undefined);

    Object.defineProperty(window.history, "length", {
      configurable: true,
      value: 1,
    });

    expect(goBack()).toBe(false);
    expect(back).not.toHaveBeenCalled();
  });
});
