import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { goBack } from "@/shared/helpers/go-back";
import NotFound from "./not-found";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("@/shared/helpers/go-back", () => ({
  goBack: vi.fn(),
}));

describe("NotFound", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns to the previous page", async () => {
    vi.mocked(goBack).mockReturnValue(true);
    const user = userEvent.setup();

    render(<NotFound />);
    await user.click(screen.getByRole("button", { name: "GO BACK" }));

    expect(goBack).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalled();
  });

  it("opens the home page when there is no history", async () => {
    vi.mocked(goBack).mockReturnValue(false);
    const user = userEvent.setup();

    render(<NotFound />);
    await user.click(screen.getByRole("button", { name: "GO BACK" }));

    expect(replace).toHaveBeenCalledWith("/");
  });
});
