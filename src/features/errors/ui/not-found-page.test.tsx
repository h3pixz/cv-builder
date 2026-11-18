import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotFoundPage } from "./not-found-page";

describe("NotFoundPage", () => {
  it("renders the illustration, message and go back button", () => {
    const { container } = render(<NotFoundPage onGoBack={vi.fn()} />);

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hmm…" })).toBeInTheDocument();
    expect(
      screen.getByText(/This doesn’t seem to be the page you were looking for/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Let’s get you back on track/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "GO BACK" }),
    ).toBeInTheDocument();
  });

  it("calls onGoBack when the go back button is clicked", async () => {
    const onGoBack = vi.fn();
    const user = userEvent.setup();

    render(<NotFoundPage onGoBack={onGoBack} />);
    await user.click(screen.getByRole("button", { name: "GO BACK" }));

    expect(onGoBack).toHaveBeenCalledTimes(1);
  });
});
