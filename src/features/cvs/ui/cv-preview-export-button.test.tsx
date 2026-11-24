import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CvPreviewExportButton } from "./cv-preview-export-button";

const { exportCvPdfAction, toastAdd } = vi.hoisted(() => ({
  exportCvPdfAction: vi.fn(),
  toastAdd: vi.fn(),
}));

vi.mock("../api/cv-preview.actions", () => ({ exportCvPdfAction }));

vi.mock("@/shared/ui/toast", () => ({ toast: { add: toastAdd } }));

const createObjectURL = vi.fn(() => "blob:cv");
const revokeObjectURL = vi.fn();
const anchorClick = vi
  .spyOn(HTMLAnchorElement.prototype, "click")
  .mockImplementation(() => {});

beforeEach(() => {
  exportCvPdfAction.mockReset();
  toastAdd.mockReset();
  createObjectURL.mockClear();
  revokeObjectURL.mockClear();
  anchorClick.mockClear();
  Object.assign(URL, { createObjectURL, revokeObjectURL });
});

describe("CvPreviewExportButton", () => {
  it("is disabled when the preview is unavailable", () => {
    render(<CvPreviewExportButton cvId="cv-1" disabled />);

    expect(screen.getByRole("button", { name: "Export PDF" })).toBeDisabled();
  });

  it("downloads the PDF and reports success", async () => {
    exportCvPdfAction.mockResolvedValue({
      success: true,
      fileName: "backend-cv.pdf",
      base64: "aGVsbG8=",
    });

    render(<CvPreviewExportButton cvId="cv-1" />);

    fireEvent.click(screen.getByRole("button", { name: "Export PDF" }));

    await waitFor(() => {
      expect(toastAdd).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" }),
      );
    });

    expect(exportCvPdfAction).toHaveBeenCalledWith("cv-1");
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(anchorClick).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:cv");
  });

  it("shows an error when the export fails", async () => {
    exportCvPdfAction.mockResolvedValue({
      success: false,
      error: "You do not have permission to perform this action.",
      code: "insufficientPermissions",
    });

    render(<CvPreviewExportButton cvId="cv-1" />);

    fireEvent.click(screen.getByRole("button", { name: "Export PDF" }));

    await waitFor(() => {
      expect(toastAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          description: "You do not have permission to perform this action.",
        }),
      );
    });

    expect(createObjectURL).not.toHaveBeenCalled();
    expect(anchorClick).not.toHaveBeenCalled();
  });
});
