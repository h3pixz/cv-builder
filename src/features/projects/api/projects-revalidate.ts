import "server-only";

import { revalidatePath } from "next/cache";

/** Changing the catalog refreshes the admin table and CV project pickers. */
export function revalidateProjectCatalog() {
  revalidatePath("/admin/projects");
  revalidatePath("/users/[userId]/cvs", "page");
  revalidatePath("/users/[userId]/cvs/[cvId]", "page");
}
