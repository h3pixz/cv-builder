import { z } from "zod";

import { SKILL_MASTERY_VALUES } from "./skill-levels";

export const SKILL_NAME_MAX = 100;

export const SKILL_MESSAGES = {
  nameRequired: "Skill is required",
  masteryRequired: "Skill mastery is required",
  categoryRequired: "Category is required",
  nameTooLong: `Skill must be at most ${SKILL_NAME_MAX} characters`,
  duplicate: "Skill already exists",
} as const;

export const skillFormSchema = z.object({
  name: z.string().trim().min(1, SKILL_MESSAGES.nameRequired),
  mastery: z.string().min(1, SKILL_MESSAGES.masteryRequired),
});

export type SkillFormValues = z.infer<typeof skillFormSchema>;

export const addMySkillSchema = z.object({
  name: z.string().trim().min(1, SKILL_MESSAGES.nameRequired),
  mastery: z.enum(SKILL_MASTERY_VALUES, {
    error: SKILL_MESSAGES.masteryRequired,
  }),
  categoryId: z.string().nullish(),
});

export type AddMySkillValues = z.infer<typeof addMySkillSchema>;

export const updateMySkillSchema = addMySkillSchema.omit({ categoryId: true });

export type UpdateMySkillValues = z.infer<typeof updateMySkillSchema>;

export const catalogSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, SKILL_MESSAGES.nameRequired)
    .max(SKILL_NAME_MAX, SKILL_MESSAGES.nameTooLong),
  categoryId: z.string().min(1, SKILL_MESSAGES.categoryRequired),
});

export type CatalogSkillValues = z.infer<typeof catalogSkillSchema>;
