import { z } from "zod"
import { passwordSchema } from "./validation"

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((values) => values.confirmPassword === values.newPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
