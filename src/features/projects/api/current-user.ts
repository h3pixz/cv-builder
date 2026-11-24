import "server-only";

import { cache } from "react";

import { getSession, getTokenPayload } from "@/shared/api";

import type { ProjectRole } from "../model/project-permissions";

export type ProjectsSessionUser = {
  id: string | null;
  role: ProjectRole | null;
};

function toRole(value: string | null): ProjectRole | null {
  if (value === "Admin" || value === "Employee") return value;

  return null;
}

export const getCurrentUser = cache(async (): Promise<ProjectsSessionUser> => {
  const session = await getSession();

  if (!session) {
    return { id: null, role: null };
  }

  const payload = getTokenPayload(session.access_token);

  return { id: payload.sub, role: toRole(payload.role) };
});
