import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "./error";

describe("ErrorPage", () => {
  it("retries the failed segment", async () => {
    const retry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorPage error={new Error("boom")} retry={retry} />);
    await user.click(screen.getByRole("button", { name: "RETRY" }));

    expect(retry).toHaveBeenCalledTimes(1);
  });
});
