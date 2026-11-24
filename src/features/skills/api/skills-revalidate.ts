import "server-only";

import { revalidatePath } from "next/cache";

export function revalidateSkillCatalog() {
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
}

export function revalidateMySkills(userId: string) {
  revalidatePath("/skills");
  revalidatePath(`/users/${userId}/skills`);
}
