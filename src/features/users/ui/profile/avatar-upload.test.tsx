import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AvatarUpload } from "./avatar-upload";

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
  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = revokeObjectURL;
});

describe("AvatarUpload", () => {
  it("shows the fallback initial", () => {
    render(<AvatarUpload initial="A" />);

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("rejects an unsupported file type", () => {
    const { container } = render(<AvatarUpload initial="A" />);

    selectFile(
      container,
      new File(["text"], "notes.txt", { type: "text/plain" }),
    );

    expect(screen.getByText("Use png, jpg or gif")).toBeInTheDocument();
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it("rejects a file larger than 5MB", () => {
    const { container } = render(<AvatarUpload initial="A" />);

    selectFile(
      container,
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "photo.png", {
        type: "image/png",
      }),
    );

    expect(screen.getByText("File is larger than 5MB")).toBeInTheDocument();
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it("previews a valid image and clears a previous error", () => {
    const { container } = render(<AvatarUpload initial="A" />);

    selectFile(
      container,
      new File(["text"], "notes.txt", { type: "text/plain" }),
    );
    expect(screen.getByText("Use png, jpg or gif")).toBeInTheDocument();

    const image = new File(["image"], "photo.png", { type: "image/png" });
    selectFile(container, image);

    expect(createObjectURL).toHaveBeenCalledWith(image);
    expect(screen.queryByText("Use png, jpg or gif")).not.toBeInTheDocument();
  });

  it("does nothing when the selection is empty", () => {
    const { container } = render(<AvatarUpload initial="A" />);

    fireEvent.change(fileInput(container), { target: { files: [] } });

    expect(createObjectURL).not.toHaveBeenCalled();
  });
});
