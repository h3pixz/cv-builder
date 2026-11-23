import {
  getGraphQLErrorCode,
  getGraphQLErrorMessage,
  type GraphQLErrorCode,
} from "@/shared/api";

import { DEPARTMENT_MESSAGES } from "./department-schema";

export type DepartmentField = "name";

export type DepartmentsActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
      code: GraphQLErrorCode | null;
      /** The field the error belongs to, so forms can show it inline. */
      field?: DepartmentField;
    };

type GraphQLErrorLike = {
  response?: {
    errors?: { message?: unknown }[];
  };
};

/**
 * The backend rejects deleting a department that is still referenced by
 * employees or other entities. Its exact error code is not part of the shared
 * error map, so related messages are recognised by their text.
 */
const DEPARTMENT_IN_USE_PATTERN =
  /in.?use|has.?relation|foreign.?key|cannot be deleted|referenc|assigned|department.*(employee|position|project)/i;

function getRawErrorMessage(error: unknown): string | null {
  const message = (error as GraphQLErrorLike | null)?.response?.errors?.[0]
    ?.message;

  return typeof message === "string" ? message : null;
}

export function toDepartmentsActionError(
  error: unknown,
): DepartmentsActionResult {
  const code = getGraphQLErrorCode(error);

  if (!code) {
    const raw = getRawErrorMessage(error);

    if (raw && DEPARTMENT_IN_USE_PATTERN.test(raw)) {
      return { success: false, error: DEPARTMENT_MESSAGES.inUse, code: null };
    }
  }

  return {
    success: false,
    error: getGraphQLErrorMessage(error),
    code,
  };
}
