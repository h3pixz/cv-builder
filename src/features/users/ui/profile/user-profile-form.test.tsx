import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserProfileForm } from "./user-profile-form";

const { updateProfileAction, sendVerificationEmailAction, push, refresh } =
  vi.hoisted(() => ({
    updateProfileAction: vi.fn(),
    sendVerificationEmailAction: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
  }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("../../api/profile.actions", () => ({
  updateProfileAction,
  sendVerificationEmailAction,
}));

vi.mock("@/shared/ui/toast", () => ({ toast: { add: vi.fn() } }));

const departments = [
  { value: "dep-1", label: "Engineering" },
  { value: "dep-2", label: "Design" },
];

const positions = [
  { value: "pos-1", label: "Developer" },
  { value: "pos-2", label: "Manager" },
];

const values = {
  firstName: "Ada",
  lastName: "Lovelace",
  departmentId: "dep-1",
  positionId: "pos-1",
};

function renderForm(overrides: Partial<React.ComponentProps<typeof UserProfileForm>> = {}) {
  return render(
    <UserProfileForm
      userId="user-1"
      values={values}
      departmentName="Engineering"
      positionName="Developer"
      departments={departments}
      positions={positions}
      canEdit
      canVerifyEmail
      isVerified={false}
      {...overrides}
    />,
  );
}

beforeEach(() => {
  updateProfileAction.mockReset();
  sendVerificationEmailAction.mockReset();
  push.mockReset();
  refresh.mockReset();
});

describe("UserProfileForm", () => {
  it("renders read-only fields without actions for an employee viewing another profile", () => {
    renderForm({ canEdit: false, canVerifyEmail: false });

    expect(screen.getByLabelText("First Name")).toHaveValue("Ada");
    expect(screen.getByLabelText("First Name")).toHaveAttribute("readonly");
    expect(screen.getByLabelText("Department")).toHaveValue("Engineering");
    expect(screen.getByLabelText("Department")).toHaveAttribute("readonly");
    expect(screen.queryByRole("button", { name: "Update" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: /verify email/i }),
    ).toBeNull();
  });

  it("shows the verify email action to the profile owner and hides it otherwise", () => {
    const { rerender } = renderForm();

    expect(
      screen.getByRole("button", { name: /verify email/i }),
    ).toBeEnabled();

    rerender(
      <UserProfileForm
        userId="user-1"
        values={values}
        departmentName="Engineering"
        positionName="Developer"
        departments={departments}
        positions={positions}
        canEdit
        canVerifyEmail={false}
        isVerified={false}
      />,
    );

    expect(screen.queryByRole("button", { name: /verify email/i })).toBeNull();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("disables Update until a value changes and submits the update", async () => {
    updateProfileAction.mockResolvedValue({ success: true });

    renderForm();

    const updateButton = screen.getByRole("button", { name: "Update" });
    expect(updateButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Grace" },
    });

    await waitFor(() => expect(updateButton).toBeEnabled());

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateProfileAction).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({ firstName: "Grace" }),
      );
    });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });

  it("shows inline validation messages", async () => {
    renderForm();

    const firstName = screen.getByLabelText("First Name");
    fireEvent.change(firstName, { target: { value: "  " } });
    fireEvent.blur(firstName);

    expect(
      await screen.findByText("First name is required"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });

  it("sends the verification email and opens the verification page", async () => {
    sendVerificationEmailAction.mockResolvedValue({ success: true });

    renderForm();

    fireEvent.click(screen.getByRole("button", { name: /verify email/i }));

    await waitFor(() =>
      expect(sendVerificationEmailAction).toHaveBeenCalled(),
    );
    expect(push).toHaveBeenCalledWith("/verify-email");
  });

  it("stays on the page and shows an error when the verification email fails", async () => {
    sendVerificationEmailAction.mockResolvedValue({
      success: false,
      error: "Failed to send verification email",
      code: null,
    });

    renderForm();

    fireEvent.click(screen.getByRole("button", { name: /verify email/i }));

    expect(
      await screen.findByText("Failed to send verification email"),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
