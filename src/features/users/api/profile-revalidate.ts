import "server-only";

import { revalidatePath } from "next/cache";

export function revalidateUser(userId: string) {
  revalidatePath("/users");
  revalidatePath(`/users/${userId}`, "layout");
}
