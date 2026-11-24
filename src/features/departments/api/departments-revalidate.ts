import "server-only";

import { revalidatePath } from "next/cache";

export function revalidateDepartmentCatalog() {
  revalidatePath("/admin/departments");
  revalidatePath("/users");
  revalidatePath("/users/[userId]/profile", "page");
}
