export const LANGUAGE_PROFICIENCY_VALUES = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Native",
] as const;

export type LanguageProficiencyValue =
  (typeof LANGUAGE_PROFICIENCY_VALUES)[number];

export const PROFICIENCY_MAX = LANGUAGE_PROFICIENCY_VALUES.length;

export function proficiencyLevel(value: string): number {
  return (
    LANGUAGE_PROFICIENCY_VALUES.indexOf(value as LanguageProficiencyValue) + 1
  );
}

export type LanguageItem = {
  name: string;
  /** Numeric level used by the `Level` meter. */
  level: number;
  /** Raw proficiency value shown next to the meter. */
  levelLabel: string;
};
