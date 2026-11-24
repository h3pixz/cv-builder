import { describe, expect, it } from "vitest";

import { PASSWORD_MESSAGES, changePasswordSchema } from "./password-schema";

const valid = {
  currentPassword: "old-password",
  newPassword: "new-password",
  confirmPassword: "new-password",
};

function firstMessage(values: typeof valid) {
  const result = changePasswordSchema.safeParse(values);

  return result.success ? null : result.error.issues[0]?.message;
}

describe("changePasswordSchema", () => {
  it("accepts matching passwords that meet the security rules", () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("requires the current password", () => {
    expect(firstMessage({ ...valid, currentPassword: "" })).toBe(
      PASSWORD_MESSAGES.required,
    );
  });

  it("requires a new password", () => {
    expect(firstMessage({ ...valid, newPassword: "" })).toBe(
      PASSWORD_MESSAGES.required,
    );
  });

  it("requires the confirmation password", () => {
    expect(firstMessage({ ...valid, confirmPassword: "" })).toBe(
      PASSWORD_MESSAGES.required,
    );
  });

  it("applies the shared security requirements", () => {
    expect(firstMessage({ ...valid, newPassword: "123" })).toBe(
      "Password must be at least 6 characters long",
    );
  });

  it("rejects passwords that do not match", () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      confirmPassword: "different-password",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({
      message: PASSWORD_MESSAGES.mismatch,
      path: ["confirmPassword"],
    });
  });
});
