import "server-only";

import { cache } from "react";

import { getSession, getTokenPayload } from "@/shared/api";

import type { DepartmentRole } from "../model/department-permissions";

export type DepartmentsSessionUser = {
  id: string | null;
  role: DepartmentRole | null;
};

function toRole(value: string | null): DepartmentRole | null {
  if (value === "Admin" || value === "Employee") return value;

  return null;
}

/**
 * The user id comes from the access token claims: `me.id` is the profile id,
 * while profile mutations expect the user id.
 */
export const getCurrentUser = cache(
  async (): Promise<DepartmentsSessionUser> => {
    const session = await getSession();

    if (!session) {
      return { id: null, role: null };
    }

    const payload = getTokenPayload(session.access_token);

    return { id: payload.sub, role: toRole(payload.role) };
  },
);
