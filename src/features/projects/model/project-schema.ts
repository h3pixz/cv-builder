import { z } from "zod";

export const PROJECT_NAME_MAX = 100;
export const PROJECT_DOMAIN_MAX = 100;
export const PROJECT_DESCRIPTION_MAX = 2000;

export const PROJECT_MESSAGES = {
  nameRequired: "Project name is required",
  nameTooLong: `Project name must be at most ${PROJECT_NAME_MAX} characters`,
  domainRequired: "Domain is required",
  domainTooLong: `Domain must be at most ${PROJECT_DOMAIN_MAX} characters`,
  startDateRequired: "Start date is required",
  endDateRequired: "End date is required",
  endDateBeforeStart: "End date must be later than start date",
  descriptionRequired: "Description is required",
  descriptionTooLong: `Description must be at most ${PROJECT_DESCRIPTION_MAX} characters`,
} as const;

export const projectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, PROJECT_MESSAGES.nameRequired)
      .max(PROJECT_NAME_MAX, PROJECT_MESSAGES.nameTooLong),
    domain: z
      .string()
      .trim()
      .min(1, PROJECT_MESSAGES.domainRequired)
      .max(PROJECT_DOMAIN_MAX, PROJECT_MESSAGES.domainTooLong),
    startDate: z.string().trim().min(1, PROJECT_MESSAGES.startDateRequired),
    endDate: z.string().trim().min(1, PROJECT_MESSAGES.endDateRequired),
    description: z
      .string()
      .trim()
      .min(1, PROJECT_MESSAGES.descriptionRequired)
      .max(PROJECT_DESCRIPTION_MAX, PROJECT_MESSAGES.descriptionTooLong),
    environment: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    if (
      values.startDate &&
      values.endDate &&
      values.endDate < values.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: PROJECT_MESSAGES.endDateBeforeStart,
      });
    }
  });

export type ProjectFormValues = z.infer<typeof projectSchema>;
