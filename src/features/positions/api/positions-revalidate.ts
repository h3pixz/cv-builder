import "server-only";

import { revalidatePath } from "next/cache";

/** Changing the catalog refreshes the admin table and the user form options. */
export function revalidatePositionCatalog() {
  revalidatePath("/admin/positions");
  revalidatePath("/users");
  revalidatePath("/users/[userId]/profile", "page");
}
