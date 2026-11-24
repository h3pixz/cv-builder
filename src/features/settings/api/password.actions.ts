"use server";

import { type ActionResult, runAuthed } from "@/shared/api";
import { changeUserPassword } from "@/features/users";

import {
  PASSWORD_MESSAGES,
  changePasswordSchema,
  type ChangePasswordValues,
} from "../model/password-schema";

const WRONG_CURRENT_PASSWORD_CODES = new Set([
  "invalidOldPassword",
  "oldPasswordMismatch",
  "wrongOldPassword",
  "invalidPassword",
  "wrongPassword",
  "incorrectPassword",
]);

type BackendError = {
  response?: { errors?: { message?: unknown }[] };
};

function getBackendErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const message = (error as BackendError).response?.errors?.[0]?.message;

  return typeof message === "string" ? message : null;
}

function isWrongCurrentPassword(error: unknown): boolean {
  const code = getBackendErrorCode(error);

  if (!code) {
    return false;
  }

  if (WRONG_CURRENT_PASSWORD_CODES.has(code)) {
    return true;
  }

  const lower = code.toLowerCase();

  return (
    lower.includes("password") &&
    (lower.includes("old") || lower.includes("current")) &&
    (lower.includes("invalid") ||
      lower.includes("wrong") ||
      lower.includes("incorrect") ||
      lower.includes("mismatch"))
  );
}

export async function changePasswordAction(
  values: ChangePasswordValues,
): Promise<ActionResult> {
  const parsed = changePasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? PASSWORD_MESSAGES.invalid,
      code: null,
    };
  }

  const { currentPassword, newPassword, confirmPassword } = parsed.data;

  const result = await runAuthed(async (accessToken) => {
    try {
      await changeUserPassword(
        {
          oldPassword: currentPassword,
          newPassword,
          confirmPassword,
        },
        { accessToken },
      );

      return { error: null as string | null };
    } catch (error) {
      if (isWrongCurrentPassword(error)) {
        return { error: PASSWORD_MESSAGES.currentIncorrect };
      }

      throw error;
    }
  });

  if (!result.success) {
    return result;
  }

  if (result.data.error) {
    return { success: false, error: result.data.error, code: null };
  }

  return { success: true };
}
