import "server-only";

import { cache } from "react";

import { getSession, getTokenPayload } from "@/shared/api";

import type { LanguageRole } from "../model/language-permissions";

export type LanguagesSessionUser = {
  id: string | null;
  role: LanguageRole | null;
};

function toRole(value: string | null): LanguageRole | null {
  if (value === "Admin" || value === "Employee") return value;

  return null;
}

export const getCurrentUser = cache(async (): Promise<LanguagesSessionUser> => {
  const session = await getSession();

  if (!session) {
    return { id: null, role: null };
  }

  const payload = getTokenPayload(session.access_token);

  return { id: payload.sub, role: toRole(payload.role) };
});
