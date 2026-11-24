import { render, screen } from "@testing-library/react";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { DeviceGuard } from "./device-guard";

vi.mock("@/shared/hooks/use-media-query", () => ({
  useMediaQuery: vi.fn(),
}));

describe("DeviceGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMediaQuery).mockReturnValue(false);
  });

  it("renders children without the overlay on supported screens", () => {
    render(
      <DeviceGuard>
        <p>page content</p>
      </DeviceGuard>,
    );

    expect(screen.getByText("page content")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Oops" })).toBeNull();
  });

  it("shows the device error page over inert content on unsupported screens", () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);

    render(
      <DeviceGuard>
        <p>page content</p>
      </DeviceGuard>,
    );

    expect(screen.getByRole("heading", { name: "Oops" })).toBeInTheDocument();
    expect(
      screen.getByText(/This app isn’t supported on mobile devices/),
    ).toBeInTheDocument();
    expect(screen.getByText("page content").parentElement).toHaveAttribute(
      "inert",
    );
  });
});
