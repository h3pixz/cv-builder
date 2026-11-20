import "server-only";

import { revalidatePath } from "next/cache";

/** Changing the catalog refreshes the admin table and the add-language options. */
export function revalidateLanguageCatalog() {
  revalidatePath("/admin/languages");
  revalidatePath("/languages");
}

/** A user's languages appear on the standalone page and the user tab. */
export function revalidateLanguages(userId: string) {
  revalidatePath("/languages");
  revalidatePath(`/users/${userId}/languages`);
}
