export type SkillRecord = {
  id: string;
  name: string;
  categoryId: string;
  /** Parent category name, shown in the "Type" column. */
  type: string;
  /** Leaf category name, shown in the "Category" column. */
  category: string;
};

export type SkillCategoryOption = {
  /** Category id sent to the backend. */
  value: string;
  label: string;
  /** Name displayed in the read-only "Type" field. */
  typeName: string;
};

type CategoryNode = {
  id: string;
  name: string;
  order: number;
  children: { id: string; name: string; order: number }[];
};

function byOrder<T extends { order: number }>(a: T, b: T) {
  return a.order - b.order;
}

/**
 * The backend stores skills in leaf categories and derives the skill type from
 * the parent category. A category without children is its own type.
 *
 * The response may list a child category both under its parent and as a root
 * entry, so options are deduplicated by id; the entry that knows its parent
 * wins because it carries the correct type name.
 */
export function flattenSkillCategories(
  categories: CategoryNode[],
): SkillCategoryOption[] {
  const options = new Map<string, SkillCategoryOption>();

  for (const category of [...categories].sort(byOrder)) {
    if (category.children.length > 0) {
      for (const child of [...category.children].sort(byOrder)) {
        options.set(child.id, {
          value: child.id,
          label: `${category.name} / ${child.name}`,
          typeName: category.name,
        });
      }
      continue;
    }

    if (!options.has(category.id)) {
      options.set(category.id, {
        value: category.id,
        label: category.name,
        typeName: category.name,
      });
    }
  }

  return [...options.values()];
}
