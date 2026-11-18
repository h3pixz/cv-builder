import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useSelectedLayoutSegment: () => "profile",
}));

import { UserTabs } from "./user-tabs";

describe("UserTabs", () => {
  it("shows the CVs tab to admins", () => {
    render(<UserTabs userId="user-1" showCvs />);

    expect(screen.getByRole("link", { name: "CVs" })).toHaveAttribute(
      "href",
      "/users/user-1/cvs",
    );
  });

  it("hides the CVs tab from employees", () => {
    render(<UserTabs userId="user-1" showCvs={false} />);

    expect(screen.queryByRole("link", { name: "CVs" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Profile" })).toBeInTheDocument();
  });
});
