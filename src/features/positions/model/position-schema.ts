import { z } from "zod";

export const POSITION_NAME_MAX = 100;

export const POSITION_MESSAGES = {
  nameRequired: "Position name is required",
  nameTooLong: `Position name must be at most ${POSITION_NAME_MAX} characters`,
  duplicate: "Position already exists",
  inUse: "Position cannot be deleted because it is currently in use",
} as const;

/** Schema for the admin position catalog create/edit dialog. */
export const catalogPositionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, POSITION_MESSAGES.nameRequired)
    .max(POSITION_NAME_MAX, POSITION_MESSAGES.nameTooLong),
});

export type CatalogPositionValues = z.infer<typeof catalogPositionSchema>;
