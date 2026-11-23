import { z } from "zod";

export const DEPARTMENT_NAME_MAX = 100;

export const DEPARTMENT_MESSAGES = {
  nameRequired: "Department name is required",
  nameTooLong: `Department name must be at most ${DEPARTMENT_NAME_MAX} characters`,
  duplicate: "Department already exists",
  inUse: "Department cannot be deleted because it is currently in use",
} as const;

/** Schema for the admin department catalog create/edit dialog. */
export const catalogDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, DEPARTMENT_MESSAGES.nameRequired)
    .max(DEPARTMENT_NAME_MAX, DEPARTMENT_MESSAGES.nameTooLong),
});

export type CatalogDepartmentValues = z.infer<typeof catalogDepartmentSchema>;
