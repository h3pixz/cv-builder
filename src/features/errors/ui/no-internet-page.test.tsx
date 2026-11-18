import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoInternetPage } from "./no-internet-page";

describe("NoInternetPage", () => {
  it("renders the illustration, message and retry button", () => {
    const { container } = render(<NoInternetPage onRetry={vi.fn()} />);

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Oops" })).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "RETRY" })).toBeInTheDocument();
  });

  it("calls onRetry when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    render(<NoInternetPage onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: "RETRY" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
