import "server-only";

import { revalidatePath } from "next/cache";

export function revalidateProjectCatalog() {
  revalidatePath("/admin/projects");
  revalidatePath("/users/[userId]/cvs", "page");
  revalidatePath("/users/[userId]/cvs/[cvId]", "page");
}
