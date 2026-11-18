import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CvRecord } from "../../model/cv-record";

const { createCvAction, updateCvAction, refresh, toastAdd } = vi.hoisted(
  () => ({
    createCvAction: vi.fn(),
    updateCvAction: vi.fn(),
    refresh: vi.fn(),
    toastAdd: vi.fn(),
  }),
);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("../../api/cvs.actions", () => ({
  createCvAction,
  updateCvAction,
}));

vi.mock("@/shared/ui/toast", () => ({
  toast: { add: toastAdd },
}));

vi.mock("@/shared/ui/dialog", () => {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>;
  }

  return {
    Dialog: ({
      open,
      children,
    }: {
      open: boolean;
      children?: React.ReactNode;
    }) => (open ? <div>{children}</div> : null),
    DialogContent: Wrapper,
    DialogHeader: Wrapper,
    DialogFooter: Wrapper,
    DialogTitle: ({ children }: { children?: React.ReactNode }) => (
      <h2>{children}</h2>
    ),
    DialogDescription: ({ children }: { children?: React.ReactNode }) => (
      <p>{children}</p>
    ),
  };
});

import { CvDialog } from "./cv-dialog";

const cv: CvRecord = {
  id: "cv-1",
  name: "Frontend CV",
  education: "BSUIR",
  description: "Built the design system.",
};

function fillCreateForm() {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Backend CV" },
  });
  fireEvent.change(screen.getByLabelText("Education"), {
    target: { value: "BSU" },
  });
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Built APIs." },
  });
}

beforeEach(() => {
  createCvAction.mockReset();
  updateCvAction.mockReset();
  refresh.mockReset();
  toastAdd.mockReset();
});

describe("CvDialog", () => {
  it("keeps CREATE disabled until all required fields are filled", () => {
    render(
      <CvDialog
        mode="create"
        userId="user-1"
        open
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();

    fillCreateForm();

    expect(screen.getByRole("button", { name: "Create" })).toBeEnabled();
  });

  it("shows inline validation messages", async () => {
    render(
      <CvDialog
        mode="create"
        userId="user-1"
        open
        onOpenChange={vi.fn()}
      />,
    );

    const form = screen
      .getByRole("button", { name: "Create" })
      .closest("form");
    fireEvent.submit(form!);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Education is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(createCvAction).not.toHaveBeenCalled();
  });

  it("creates a CV for the selected employee and closes", async () => {
    const onOpenChange = vi.fn();
    createCvAction.mockResolvedValue({ success: true });

    render(
      <CvDialog
        mode="create"
        userId="user-1"
        open
        onOpenChange={onOpenChange}
      />,
    );

    fillCreateForm();
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() =>
      expect(createCvAction).toHaveBeenCalledWith("user-1", {
        name: "Backend CV",
        education: "BSU",
        description: "Built APIs.",
      }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(refresh).toHaveBeenCalled();
  });

  it("keeps the dialog open and the values on a system error", async () => {
    const onOpenChange = vi.fn();
    createCvAction.mockResolvedValue({
      success: false,
      error: "Something went wrong",
      code: null,
    });

    render(
      <CvDialog
        mode="create"
        userId="user-1"
        open
        onOpenChange={onOpenChange}
      />,
    );

    fillCreateForm();
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(
      await screen.findByText("Something went wrong"),
    ).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(screen.getByLabelText("Name")).toHaveValue("Backend CV");
    expect(screen.getByLabelText("Education")).toHaveValue("BSU");
    expect(screen.getByLabelText("Description")).toHaveValue("Built APIs.");
    expect(toastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
  });

  it("pre-fills the update form and saves the changes", async () => {
    const onOpenChange = vi.fn();
    updateCvAction.mockResolvedValue({ success: true });

    render(
      <CvDialog
        mode="update"
        userId="user-1"
        cv={cv}
        open
        onOpenChange={onOpenChange}
      />,
    );

    expect(screen.getByLabelText("Name")).toHaveValue("Frontend CV");
    expect(screen.getByLabelText("Education")).toHaveValue("BSUIR");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Built the design system.",
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Senior Frontend CV" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(updateCvAction).toHaveBeenCalledWith("user-1", "cv-1", {
        name: "Senior Frontend CV",
        education: "BSUIR",
        description: "Built the design system.",
      }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(refresh).toHaveBeenCalled();
  });
});
