import "server-only";

import { revalidatePath } from "next/cache";

/** Changing the catalog refreshes the admin table and the add-skill options. */
export function revalidateSkillCatalog() {
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
}

/** The signed-in user's skills appear on the standalone page and the user tab. */
export function revalidateMySkills(userId: string) {
  revalidatePath("/skills");
  revalidatePath(`/users/${userId}/skills`);
}
