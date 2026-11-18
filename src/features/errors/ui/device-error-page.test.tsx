import { render, screen } from "@testing-library/react";
import { DeviceErrorPage } from "./device-error-page";

describe("DeviceErrorPage", () => {
  it("renders the illustration and unsupported device message", () => {
    const { container } = render(<DeviceErrorPage />);

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Oops" })).toBeInTheDocument();
    expect(
      screen.getByText(/This app isn’t supported on mobile devices/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please open it on a desktop or tablet to continue/),
    ).toBeInTheDocument();
  });
});
