import "server-only";

import { revalidatePath } from "next/cache";

export function revalidateLanguageCatalog() {
  revalidatePath("/admin/languages");
  revalidatePath("/languages");
}

export function revalidateLanguages(userId: string) {
  revalidatePath("/languages");
  revalidatePath(`/users/${userId}/languages`);
}
