import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CvDetailsForm } from "./cv-details-form";

const { updateCvAction, refresh, toastAdd } = vi.hoisted(() => ({
  updateCvAction: vi.fn(),
  refresh: vi.fn(),
  toastAdd: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("../api/cvs.actions", () => ({
  updateCvAction,
}));

vi.mock("@/shared/ui/toast", () => ({ toast: { add: toastAdd } }));

const values = {
  name: "Backend CV",
  education: "Computer Science",
  description: "Backend engineer with five years of experience.",
};

function renderForm() {
  return render(
    <CvDetailsForm cvId="cv-1" ownerUserId="user-1" values={values} />,
  );
}

beforeEach(() => {
  updateCvAction.mockReset();
  refresh.mockReset();
  toastAdd.mockReset();
});

describe("CvDetailsForm", () => {
  it("pre-populates the fields and disables Update", () => {
    renderForm();

    expect(screen.getByLabelText("Name")).toHaveValue(values.name);
    expect(screen.getByLabelText("Education")).toHaveValue(values.education);
    expect(screen.getByLabelText("Description")).toHaveValue(
      values.description,
    );
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });

  it("enables Update after a change and saves the CV", async () => {
    updateCvAction.mockResolvedValue({ success: true });

    renderForm();

    const updateButton = screen.getByRole("button", { name: "Update" });

    fireEvent.change(screen.getByLabelText("Education"), {
      target: { value: "Applied Mathematics" },
    });

    await waitFor(() => expect(updateButton).toBeEnabled());

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateCvAction).toHaveBeenCalledWith(
        "user-1",
        "cv-1",
        expect.objectContaining({ education: "Applied Mathematics" }),
      );
    });
    expect(refresh).toHaveBeenCalled();
    expect(toastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
    await waitFor(() => expect(updateButton).toBeDisabled());
  });

  it("shows a saving state while the update is in progress", async () => {
    let resolveAction: (value: { success: boolean }) => void = () => {};
    updateCvAction.mockReturnValue(
      new Promise<{ success: boolean }>((resolve) => {
        resolveAction = resolve;
      }),
    );

    renderForm();

    fireEvent.change(screen.getByLabelText("Education"), {
      target: { value: "Applied Mathematics" },
    });

    const updateButton = screen.getByRole("button", { name: "Update" });
    await waitFor(() => expect(updateButton).toBeEnabled());
    fireEvent.click(updateButton);

    const savingButton = await screen.findByRole("button", { name: /Saving/ });
    expect(savingButton).toBeDisabled();
    expect(savingButton).toHaveAttribute("aria-busy", "true");

    resolveAction({ success: true });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument(),
    );
  });

  it("keeps the entered values and shows an error when saving fails", async () => {
    updateCvAction.mockResolvedValue({
      success: false,
      error: "Something went wrong",
      code: null,
    });

    renderForm();

    const nameInput = screen.getByLabelText("Name");
    const updateButton = screen.getByRole("button", { name: "Update" });

    fireEvent.change(nameInput, { target: { value: "Renamed CV" } });
    await waitFor(() => expect(updateButton).toBeEnabled());
    fireEvent.click(updateButton);

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(nameInput).toHaveValue("Renamed CV");
    expect(refresh).not.toHaveBeenCalled();
    expect(toastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
  });

  it("shows inline validation and disables Update when a field is empty", async () => {
    renderForm();

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.blur(nameInput);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });
});
