export type SkillRecord = {
  id: string;
  name: string;
  categoryId: string;
  type: string;
  category: string;
};

export type SkillCategoryOption = {
  value: string;
  label: string;
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
