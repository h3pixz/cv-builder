import "server-only";

import {
  ERROR_MESSAGES,
  getSession,
  isUnauthorizedError,
  refreshSession,
} from "@/shared/api";

import {
  toDepartmentsActionError,
  type DepartmentsActionResult,
} from "../model/action-result";

export type DepartmentsActionFailure = Extract<
  DepartmentsActionResult,
  { success: false }
>;

export type AuthedResult<T> =
  | { success: true; data: T }
  | DepartmentsActionFailure;

export function unauthorizedFailure(): DepartmentsActionFailure {
  return {
    success: false,
    error: ERROR_MESSAGES.unauthorized,
    code: "unauthorized",
  };
}

export function forbiddenFailure(): DepartmentsActionFailure {
  return {
    success: false,
    error: ERROR_MESSAGES.insufficientPermissions,
    code: "insufficientPermissions",
  };
}

export async function runAuthed<T>(
  operation: (accessToken: string) => Promise<T>,
): Promise<AuthedResult<T>> {
  const session = await getSession();

  if (!session) {
    return unauthorizedFailure();
  }

  try {
    return { success: true, data: await operation(session.access_token) };
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      return toDepartmentsActionError(error) as DepartmentsActionFailure;
    }
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    return unauthorizedFailure();
  }

  try {
    return { success: true, data: await operation(refreshed.access_token) };
  } catch (error) {
    return toDepartmentsActionError(error) as DepartmentsActionFailure;
  }
}
