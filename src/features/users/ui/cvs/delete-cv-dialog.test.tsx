import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CvRecord } from "../../model/cv-record";

const { deleteCvAction, refresh, toastAdd } = vi.hoisted(() => ({
  deleteCvAction: vi.fn(),
  refresh: vi.fn(),
  toastAdd: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("../../api/cvs.actions", () => ({
  deleteCvAction,
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

import { DeleteCvDialog } from "./delete-cv-dialog";

const cv: CvRecord = {
  id: "cv-1",
  name: "Frontend CV",
  education: "BSUIR",
  description: "Built the design system.",
};

beforeEach(() => {
  deleteCvAction.mockReset();
  refresh.mockReset();
  toastAdd.mockReset();
});

describe("DeleteCvDialog", () => {
  it("shows the selected CV name in the confirmation", () => {
    render(
      <DeleteCvDialog
        userId="user-1"
        cv={cv}
        open
        onOpenChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Are you sure you want to delete CV Frontend CV?"),
    ).toBeInTheDocument();
  });

  it("deletes the CV and closes on confirm", async () => {
    const onOpenChange = vi.fn();
    deleteCvAction.mockResolvedValue({ success: true });

    render(
      <DeleteCvDialog
        userId="user-1"
        cv={cv}
        open
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() =>
      expect(deleteCvAction).toHaveBeenCalledWith("user-1", "cv-1"),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(refresh).toHaveBeenCalled();
  });

  it("keeps the dialog open and shows a toast on failure", async () => {
    const onOpenChange = vi.fn();
    deleteCvAction.mockResolvedValue({
      success: false,
      error: "Something went wrong",
      code: null,
    });

    render(
      <DeleteCvDialog
        userId="user-1"
        cv={cv}
        open
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() =>
      expect(toastAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          description: "Something went wrong",
        }),
      ),
    );
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
