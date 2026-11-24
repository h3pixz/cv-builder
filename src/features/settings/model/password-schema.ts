import { z } from "zod";

import { passwordSchema } from "@/features/auth/model/validation";

export const PASSWORD_MESSAGES = {
  required: "Password is required",
  mismatch: "Passwords do not match",
  currentIncorrect: "Current password is incorrect",
  invalid: "Invalid password data",
} as const;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, PASSWORD_MESSAGES.required),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, PASSWORD_MESSAGES.required),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: PASSWORD_MESSAGES.mismatch,
    path: ["confirmPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
