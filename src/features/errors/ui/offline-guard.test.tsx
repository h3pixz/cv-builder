import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { reloadPage } from "@/shared/helpers/reload-page";
import { useOnlineStatus } from "@/shared/hooks/use-online-status";
import { OfflineGuard } from "./offline-guard";

vi.mock("@/shared/hooks/use-online-status", () => ({
  useOnlineStatus: vi.fn(),
}));

vi.mock("@/shared/helpers/reload-page", () => ({
  reloadPage: vi.fn(),
}));

describe("OfflineGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOnlineStatus).mockReturnValue(true);
  });

  it("renders children without the overlay when online", () => {
    render(
      <OfflineGuard>
        <p>page content</p>
      </OfflineGuard>,
    );

    expect(screen.getByText("page content")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Oops" })).toBeNull();
  });

  it("shows the no internet page over the children when offline", async () => {
    vi.mocked(useOnlineStatus).mockReturnValue(false);
    const user = userEvent.setup();

    render(
      <OfflineGuard>
        <p>page content</p>
      </OfflineGuard>,
    );

    expect(screen.getByText("page content")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Oops" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "RETRY" }));

    expect(reloadPage).toHaveBeenCalledTimes(1);
  });
});
