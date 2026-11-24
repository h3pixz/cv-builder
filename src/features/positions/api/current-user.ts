import "server-only";

import { cache } from "react";

import { getSession, getTokenPayload } from "@/shared/api";

import type { PositionRole } from "../model/position-permissions";

export type PositionsSessionUser = {
  id: string | null;
  role: PositionRole | null;
};

function toRole(value: string | null): PositionRole | null {
  if (value === "Admin" || value === "Employee") return value;

  return null;
}

export const getCurrentUser = cache(
  async (): Promise<PositionsSessionUser> => {
    const session = await getSession();

    if (!session) {
      return { id: null, role: null };
    }

    const payload = getTokenPayload(session.access_token);

    return { id: payload.sub, role: toRole(payload.role) };
  },
);
