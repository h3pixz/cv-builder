import { z } from "zod";

import { LANGUAGE_PROFICIENCY_VALUES } from "./language-levels";

export const LANGUAGE_NAME_MAX = 100;
export const LANGUAGE_ISO_MAX = 2;

export const LANGUAGE_MESSAGES = {
  nameRequired: "Language is required",
  proficiencyRequired: "Language proficiency is required",
  catalogNameRequired: "Name is required",
  nativeNameRequired: "Native name is required",
  isoRequired: "ISO is required",
  isoTooLong: `ISO must be at most ${LANGUAGE_ISO_MAX} characters`,
  nameTooLong: `Language must be at most ${LANGUAGE_NAME_MAX} characters`,
  duplicateName: "Language already exists",
  duplicateIso: "ISO code already exists",
} as const;

export const languageFormSchema = z.object({
  name: z.string().trim().min(1, LANGUAGE_MESSAGES.nameRequired),
  mastery: z.string().min(1, LANGUAGE_MESSAGES.proficiencyRequired),
});

export type LanguageFormValues = z.infer<typeof languageFormSchema>;

export const addMyLanguageSchema = z.object({
  name: z.string().trim().min(1, LANGUAGE_MESSAGES.nameRequired),
  mastery: z.enum(LANGUAGE_PROFICIENCY_VALUES, {
    error: LANGUAGE_MESSAGES.proficiencyRequired,
  }),
});

export type AddMyLanguageValues = z.infer<typeof addMyLanguageSchema>;

export const updateMyLanguageSchema = addMyLanguageSchema;

export type UpdateMyLanguageValues = z.infer<typeof updateMyLanguageSchema>;

export const catalogLanguageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, LANGUAGE_MESSAGES.catalogNameRequired)
    .max(LANGUAGE_NAME_MAX, LANGUAGE_MESSAGES.nameTooLong),
  iso2: z
    .string()
    .trim()
    .min(1, LANGUAGE_MESSAGES.isoRequired)
    .max(LANGUAGE_ISO_MAX, LANGUAGE_MESSAGES.isoTooLong),
  nativeName: z.string().trim().min(1, LANGUAGE_MESSAGES.nativeNameRequired),
});

export type CatalogLanguageValues = z.infer<typeof catalogLanguageSchema>;
