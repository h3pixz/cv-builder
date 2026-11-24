import { z } from "zod";

import { USER_ROLES } from "@/shared/types/user-role";

const firstNameSchema = z
  .string()
  .trim()
  .min(1, "First name is required");

const lastNameSchema = z.string().trim().min(1, "Last name is required");

const departmentIdSchema = z.string().min(1, "Department is required");

const positionIdSchema = z.string().min(1, "Position is required");

const roleSchema = z.enum(USER_ROLES, { error: "Role is required" });

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must contain at least 6 characters"),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  departmentId: departmentIdSchema,
  positionId: positionIdSchema,
  role: roleSchema,
});

export const updateUserSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  departmentId: departmentIdSchema,
  positionId: positionIdSchema,
  role: roleSchema,
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type UpdateUserValues = z.infer<typeof updateUserSchema>;
