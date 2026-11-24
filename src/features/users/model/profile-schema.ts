import { z } from "zod";

export const PROFILE_NAME_MAX_LENGTH = 100;

const firstNameSchema = z
  .string()
  .trim()
  .min(1, "First name is required")
  .max(
    PROFILE_NAME_MAX_LENGTH,
    `First name must be ${PROFILE_NAME_MAX_LENGTH} characters or fewer`,
  );

const lastNameSchema = z
  .string()
  .trim()
  .min(1, "Last name is required")
  .max(
    PROFILE_NAME_MAX_LENGTH,
    `Last name must be ${PROFILE_NAME_MAX_LENGTH} characters or fewer`,
  );

const departmentIdSchema = z.string().min(1, "Department is required");

const positionIdSchema = z.string().min(1, "Position is required");

export const profileSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  departmentId: departmentIdSchema,
  positionId: positionIdSchema,
});

export type ProfileValues = z.infer<typeof profileSchema>;
