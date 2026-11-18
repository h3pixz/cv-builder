import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AvatarUpload } from "./avatar-upload";

const { uploadAvatarAction, refresh } = vi.hoisted(() => ({
  uploadAvatarAction: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh }),
}));

vi.mock("../../api/profile.actions", () => ({ uploadAvatarAction }));

vi.mock("@/shared/ui/toast", () => ({ toast: { add: vi.fn() } }));

const createObjectURL = vi.fn(() => "blob:preview");
const revokeObjectURL = vi.fn();

function fileInput(container: HTMLElement) {
  return container.querySelector<HTMLInputElement>('input[type="file"]')!;
}

function selectFile(container: HTMLElement, file: File) {
  fireEvent.change(fileInput(container), { target: { files: [file] } });
}

beforeEach(() => {
  createObjectURL.mockClear();
  revokeObjectURL.mockClear();
  uploadAvatarAction.mockReset();
  refresh.mockReset();
  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = revokeObjectURL;
});

describe("AvatarUpload", () => {
  it("shows the fallback initial", () => {
    render(<AvatarUpload userId="user-1" initial="A" />);

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("rejects an unsupported file type", () => {
    const { container } = render(<AvatarUpload userId="user-1" initial="A" />);

    selectFile(
      container,
      new File(["text"], "notes.txt", { type: "text/plain" }),
    );

    expect(screen.getByText("Use png, jpg or gif")).toBeInTheDocument();
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(uploadAvatarAction).not.toHaveBeenCalled();
  });

  it("rejects a file larger than 5MB", () => {
    const { container } = render(<AvatarUpload userId="user-1" initial="A" />);

    selectFile(
      container,
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "photo.png", {
        type: "image/png",
      }),
    );

    expect(
      screen.getByText("File size must not exceed 5MB"),
    ).toBeInTheDocument();
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(uploadAvatarAction).not.toHaveBeenCalled();
  });

  it("previews a valid image and uploads it", async () => {
    const { container } = render(
      <AvatarUpload userId="user-1" initial="A" />,
    );

    uploadAvatarAction.mockResolvedValue({
      success: true,
      url: "https://cdn.test/avatar.png",
    });

    const image = new File(["image"], "photo.png", { type: "image/png" });
    selectFile(container, image);

    await waitFor(() => {
      expect(uploadAvatarAction).toHaveBeenCalledWith("user-1", {
        base64: "data:image/png;base64,aW1hZ2U=",
        size: 5,
        type: "image/png",
      });
    });

    expect(createObjectURL).toHaveBeenCalledWith(image);
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });

  it("shows an error when the upload fails", async () => {
    const { container } = render(
      <AvatarUpload userId="user-1" initial="A" />,
    );

    uploadAvatarAction.mockResolvedValue({
      success: false,
      error: "Upload failed",
      code: null,
    });

    selectFile(
      container,
      new File(["image"], "photo.png", { type: "image/png" }),
    );

    expect(await screen.findByText("Upload failed")).toBeInTheDocument();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("does nothing when the selection is empty", () => {
    const { container } = render(<AvatarUpload userId="user-1" initial="A" />);

    fireEvent.change(fileInput(container), { target: { files: [] } });

    expect(createObjectURL).not.toHaveBeenCalled();
    expect(uploadAvatarAction).not.toHaveBeenCalled();
  });
});
