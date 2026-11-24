import { z } from "zod"
import { emailSchema, passwordSchema } from "./validation"

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((values) => values.confirmPassword === values.password, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type SignUpValues = z.infer<typeof signUpSchema>
