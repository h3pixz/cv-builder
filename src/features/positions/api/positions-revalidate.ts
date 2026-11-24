import "server-only";

import { revalidatePath } from "next/cache";

export function revalidatePositionCatalog() {
  revalidatePath("/admin/positions");
  revalidatePath("/users");
  revalidatePath("/users/[userId]/profile", "page");
}
