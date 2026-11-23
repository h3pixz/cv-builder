import "server-only";

import { revalidatePath } from "next/cache";

/** Changing the catalog refreshes the admin table and the user form options. */
export function revalidateDepartmentCatalog() {
  revalidatePath("/admin/departments");
  revalidatePath("/users");
  revalidatePath("/users/[userId]/profile", "page");
}
