export const SKILL_MASTERY_VALUES = [
  "Novice",
  "Advanced",
  "Competent",
  "Proficient",
  "Expert",
] as const;

export const LANGUAGE_PROFICIENCY_VALUES = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Native",
] as const;

export type SkillMasteryValue = (typeof SKILL_MASTERY_VALUES)[number];
export type LanguageProficiencyValue =
  (typeof LANGUAGE_PROFICIENCY_VALUES)[number];

export const MASTERY_MAX = SKILL_MASTERY_VALUES.length;
export const PROFICIENCY_MAX = LANGUAGE_PROFICIENCY_VALUES.length;

export function masteryLevel(value: string): number {
  return SKILL_MASTERY_VALUES.indexOf(value as SkillMasteryValue) + 1;
}

export function proficiencyLevel(value: string): number {
  return (
    LANGUAGE_PROFICIENCY_VALUES.indexOf(value as LanguageProficiencyValue) + 1
  );
}

export type LevelItem = {
  name: string;
  /** Numeric level used by the `Level` meter. */
  level: number;
  /** Raw mastery/proficiency value shown next to the meter. */
  levelLabel: string;
};

export type LevelGroup = {
  id: string;
  name: string;
  items: LevelItem[];
};

type CategoryMeta = { id: string; name: string; order: number };
type Category = CategoryMeta & { children: CategoryMeta[] };
type SkillMastery = {
  name: string;
  categoryId?: string | null;
  mastery: string;
};

export type SkillGroup = {
  id: string;
  name: string;
  order: number;
  skills: SkillMastery[];
};

export function groupSkills(
  skills: SkillMastery[],
  categories: Category[],
): SkillGroup[] {
  const known = new Map<string, CategoryMeta>();
  for (const c of categories) {
    known.set(c.id, c);
    for (const child of c.children) known.set(child.id, child);
  }

  const groups = new Map<string, SkillGroup>();
  for (const skill of skills) {
    const id = skill.categoryId ?? "other";
    const meta = known.get(id);
    const group = groups.get(id) ?? {
      id,
      name: meta?.name ?? "Other",
      order: meta?.order ?? Number.MAX_SAFE_INTEGER,
      skills: [],
    };
    group.skills.push(skill);
    groups.set(id, group);
  }

  return [...groups.values()].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
}
