import type { SessionUser } from "@/shared/api";

export function canAccessCv(
  me: SessionUser,
  ownerId: string | null | undefined,
): boolean {
  if (me.role === "Admin") return true;

  return Boolean(me.id && ownerId && me.id === ownerId);
}
