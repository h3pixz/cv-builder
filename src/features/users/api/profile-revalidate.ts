import "server-only";

import { revalidatePath } from "next/cache";

/** Every tab of the user details page lives under the same layout. */
export function revalidateUser(userId: string) {
  revalidatePath("/users");
  revalidatePath(`/users/${userId}`, "layout");
}
