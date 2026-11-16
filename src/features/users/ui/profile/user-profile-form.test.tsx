import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserProfileForm } from "./user-profile-form";

const values = {
  firstName: "Ada",
  lastName: "Lovelace",
  department: "Engineering",
  position: "Developer",
};

describe("UserProfileForm", () => {
  it("renders the profile values as read-only fields", () => {
    render(<UserProfileForm isVerified={false} values={values} />);

    expect(screen.getByLabelText("First Name")).toHaveValue("Ada");
    expect(screen.getByLabelText("Last Name")).toHaveValue("Lovelace");
    expect(screen.getByLabelText("Department")).toHaveValue("Engineering");
    expect(screen.getByLabelText("Position")).toHaveValue("Developer");
    expect(screen.getByLabelText("First Name")).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });

  it("allows verifying the email until the user is verified", () => {
    const { rerender } = render(
      <UserProfileForm isVerified={false} values={values} />,
    );

    expect(screen.getByRole("button", { name: "Verify email" })).toBeEnabled();

    rerender(<UserProfileForm isVerified values={values} />);

    expect(screen.getByRole("button", { name: "Verify email" })).toBeDisabled();
  });
});
