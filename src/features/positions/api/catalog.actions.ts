"use server";

import type { PositionsActionResult } from "../model/action-result";
import {
  POSITION_MESSAGES,
  catalogPositionSchema,
  type CatalogPositionValues,
} from "../model/position-schema";
import { canManagePositionCatalog } from "../model/position-permissions";
import {
  createPosition,
  deletePosition,
  updatePosition,
} from "./catalog.mutations";
import { getCurrentUser } from "./current-user";
import { forbiddenFailure, runAuthed } from "./run-authed";
import {
  findPositionByName,
  isPositionInUse,
} from "./positions.queries";
import { revalidatePositionCatalog } from "./positions-revalidate";

type Field = NonNullable<
  Extract<PositionsActionResult, { success: false }>["field"]
>;

function invalid(
  message: string | undefined,
  field?: Field,
): PositionsActionResult {
  return {
    success: false,
    error: message ?? "Invalid position data",
    code: null,
    field,
  };
}

function fieldFromPath(path?: PropertyKey[]): Field | undefined {
  return path?.[0] === "name" ? "name" : undefined;
}

async function canManage(): Promise<boolean> {
  const me = await getCurrentUser();

  return canManagePositionCatalog(me.role);
}

export async function createPositionAction(
  values: CatalogPositionValues,
): Promise<PositionsActionResult> {
  const parsed = catalogPositionSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;

  const result = await runAuthed(async (accessToken) => {
    if (await findPositionByName(data.name, { accessToken })) {
      return "duplicate" as const;
    }

    await createPosition({ name: data.name }, { accessToken });

    return "created" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "duplicate") {
    return {
      success: false,
      error: POSITION_MESSAGES.duplicate,
      code: null,
      field: "name",
    };
  }

  revalidatePositionCatalog();

  return { success: true };
}

export async function updatePositionAction(
  positionId: string,
  values: CatalogPositionValues,
): Promise<PositionsActionResult> {
  const parsed = catalogPositionSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;

  const result = await runAuthed(async (accessToken) => {
    if (
      await findPositionByName(data.name, {
        accessToken,
        excludeId: positionId,
      })
    ) {
      return "duplicate" as const;
    }

    await updatePosition(
      { positionId, name: data.name },
      { accessToken },
    );

    return "updated" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "duplicate") {
    return {
      success: false,
      error: POSITION_MESSAGES.duplicate,
      code: null,
      field: "name",
    };
  }

  revalidatePositionCatalog();

  return { success: true };
}

export async function deletePositionAction(
  positionId: string,
): Promise<PositionsActionResult> {
  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const result = await runAuthed(async (accessToken) => {
    if (await isPositionInUse(positionId, { accessToken })) {
      return "in-use" as const;
    }

    await deletePosition(positionId, { accessToken });

    return "deleted" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "in-use") {
    return {
      success: false,
      error: POSITION_MESSAGES.inUse,
      code: null,
    };
  }

  revalidatePositionCatalog();

  return { success: true };
}
