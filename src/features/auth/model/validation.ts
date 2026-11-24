import { z } from "zod"

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .pipe(z.email("Please enter a valid email address"))

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters long")
