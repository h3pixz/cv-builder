export const SKILL_MASTERY_VALUES = [
  "Novice",
  "Advanced",
  "Competent",
  "Proficient",
  "Expert",
] as const;

export type SkillMasteryValue = (typeof SKILL_MASTERY_VALUES)[number];

export const MASTERY_MAX = SKILL_MASTERY_VALUES.length;

export function masteryLevel(value: string): number {
  return SKILL_MASTERY_VALUES.indexOf(value as SkillMasteryValue) + 1;
}

export type SkillMastery = {
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

type CategoryMeta = { id: string; name: string; order: number };
type Category = CategoryMeta & { children: CategoryMeta[] };

export function groupSkills(
  skills: SkillMastery[],
  categories: Category[],
): SkillGroup[] {
  const known = new Map<string, CategoryMeta>();
  for (const category of categories) {
    known.set(category.id, category);
    for (const child of category.children) known.set(child.id, child);
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
