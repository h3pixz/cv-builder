import { z } from "zod";

import { LANGUAGE_PROFICIENCY_VALUES } from "./levels";

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

export const LANGUAGE_FORM_MESSAGES = {
  nameRequired: "Language is required",
  levelRequired: "Language proficiency is required",
};

export const languageFormSchema = createLevelFormSchema(
  LANGUAGE_FORM_MESSAGES,
);

/** Server-side schemas also check that the level belongs to the backend enum. */
export const addLanguageSchema = z.object({
  name: z.string().trim().min(1, LANGUAGE_FORM_MESSAGES.nameRequired),
  mastery: z.enum(LANGUAGE_PROFICIENCY_VALUES, {
    error: LANGUAGE_FORM_MESSAGES.levelRequired,
  }),
});

export const updateLanguageSchema = addLanguageSchema;
