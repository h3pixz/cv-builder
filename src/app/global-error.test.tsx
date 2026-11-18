import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { reloadPage } from "@/shared/helpers/reload-page";
import GlobalError from "./global-error";

vi.mock("./globals.css", () => ({}));

vi.mock("@/shared/helpers/reload-page", () => ({
  reloadPage: vi.fn(),
}));

describe("GlobalError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reloads the page on retry", async () => {
    const user = userEvent.setup();

    render(<GlobalError />);
    await user.click(screen.getByRole("button", { name: "RETRY" }));

    expect(reloadPage).toHaveBeenCalledTimes(1);
  });
});
