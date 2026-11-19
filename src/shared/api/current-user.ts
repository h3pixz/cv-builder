import "server-only";

import { cache } from "react";

import { USER_ROLES, type UserRoleValue } from "@/shared/types/user-role";

import { getTokenPayload } from "./jwt/jwt";
import { getSession } from "./session/session";

export type SessionUser = {
  id: string | null;
  email: string | null;
  role: UserRoleValue | null;
};

function toUserRole(value: string | null): UserRoleValue | null {
  return USER_ROLES.find((role) => role === value) ?? null;
}

export const getCurrentUser = cache(async (): Promise<SessionUser> => {
  const session = await getSession();

  if (!session) {
    return { id: null, email: null, role: null };
  }

  const payload = getTokenPayload(session.access_token);

  return {
    id: payload.sub,
    email: payload.email,
    role: toUserRole(payload.role),
  };
});
