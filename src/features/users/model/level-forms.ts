import { z } from "zod";

import {
  LANGUAGE_PROFICIENCY_VALUES,
  SKILL_MASTERY_VALUES,
} from "@/shared/helpers";

/** Messages are different for skills and languages, the shape is the same. */
export function createLevelFormSchema(messages: {
  nameRequired: string;
  levelRequired: string;
}) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired),
    mastery: z.string().min(1, messages.levelRequired),
  });
}

export type LevelFormValues = z.infer<
  ReturnType<typeof createLevelFormSchema>
>;

export const SKILL_FORM_MESSAGES = {
  nameRequired: "Skill is required",
  levelRequired: "Skill mastery is required",
};

export const LANGUAGE_FORM_MESSAGES = {
  nameRequired: "Language is required",
  levelRequired: "Language proficiency is required",
};

export const skillFormSchema = createLevelFormSchema(SKILL_FORM_MESSAGES);
export const languageFormSchema = createLevelFormSchema(
  LANGUAGE_FORM_MESSAGES,
);

/** Server-side schemas also check that the level belongs to the backend enum. */
export const addSkillSchema = z.object({
  name: z.string().trim().min(1, SKILL_FORM_MESSAGES.nameRequired),
  mastery: z.enum(SKILL_MASTERY_VALUES, {
    error: SKILL_FORM_MESSAGES.levelRequired,
  }),
  categoryId: z.string().nullish(),
});

export const updateSkillSchema = addSkillSchema.omit({ categoryId: true });

export const addLanguageSchema = z.object({
  name: z.string().trim().min(1, LANGUAGE_FORM_MESSAGES.nameRequired),
  mastery: z.enum(LANGUAGE_PROFICIENCY_VALUES, {
    error: LANGUAGE_FORM_MESSAGES.levelRequired,
  }),
});

export const updateLanguageSchema = addLanguageSchema;
