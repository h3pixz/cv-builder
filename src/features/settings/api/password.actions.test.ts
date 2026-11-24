import { beforeEach, describe, expect, it, vi } from "vitest";

const { changeUserPassword, runAuthed } = vi.hoisted(() => ({
  changeUserPassword: vi.fn(),
  runAuthed: vi.fn(),
}));

vi.mock("@/shared/api", () => ({ runAuthed }));

vi.mock("@/features/users", () => ({ changeUserPassword }));

import { changePasswordAction } from "./password.actions";

const valid = {
  currentPassword: "old-password",
  newPassword: "new-password",
  confirmPassword: "new-password",
};

beforeEach(() => {
  changeUserPassword.mockReset();
  runAuthed.mockReset();

  runAuthed.mockImplementation(
    async (operation: (token: string) => Promise<unknown>) => {
      try {
        return { success: true, data: await operation("token") };
      } catch {
        return {
          success: false,
          error: "Something went wrong. Please try again later",
          code: null,
        };
      }
    },
  );
});

describe("changePasswordAction", () => {
  it("rejects an invalid form before calling the backend", async () => {
    const result = await changePasswordAction({
      ...valid,
      currentPassword: "",
    });

    expect(result).toEqual({
      success: false,
      error: "Password is required",
      code: null,
    });
    expect(runAuthed).not.toHaveBeenCalled();
    expect(changeUserPassword).not.toHaveBeenCalled();
  });

  it("rejects passwords that do not match", async () => {
    const result = await changePasswordAction({
      ...valid,
      confirmPassword: "different-password",
    });

    expect(result).toEqual({
      success: false,
      error: "Passwords do not match",
      code: null,
    });
    expect(changeUserPassword).not.toHaveBeenCalled();
  });

  it("sends the current password as oldPassword with the access token", async () => {
    const result = await changePasswordAction(valid);

    expect(result).toEqual({ success: true });
    expect(changeUserPassword).toHaveBeenCalledWith(
      {
        oldPassword: "old-password",
        newPassword: "new-password",
        confirmPassword: "new-password",
      },
      { accessToken: "token" },
    );
  });

  it("maps a wrong current password to a readable message", async () => {
    changeUserPassword.mockRejectedValue({
      response: { errors: [{ message: "invalidOldPassword" }] },
    });

    const result = await changePasswordAction(valid);

    expect(result).toEqual({
      success: false,
      error: "Current password is incorrect",
      code: null,
    });
  });

  it("keeps other backend errors generic", async () => {
    changeUserPassword.mockRejectedValue({
      response: { errors: [{ message: "somethingUnexpected" }] },
    });

    const result = await changePasswordAction(valid);

    expect(result).toEqual({
      success: false,
      error: "Something went wrong. Please try again later",
      code: null,
    });
  });

  it("returns the runAuthed failure unchanged", async () => {
    runAuthed.mockResolvedValue({
      success: false,
      error: "Your session has expired. Please sign in again",
      code: "unauthorized",
    });

    const result = await changePasswordAction(valid);

    expect(result).toEqual({
      success: false,
      error: "Your session has expired. Please sign in again",
      code: "unauthorized",
    });
    expect(changeUserPassword).not.toHaveBeenCalled();
  });
});
