import "server-only";

import {
  ERROR_MESSAGES,
  getSession,
  isUnauthorizedError,
  refreshSession,
} from "@/shared/api";

import {
  toProjectsActionError,
  type ProjectsActionResult,
} from "../model/action-result";

export type ProjectsActionFailure = Extract<
  ProjectsActionResult,
  { success: false }
>;

export type AuthedResult<T> =
  | { success: true; data: T }
  | ProjectsActionFailure;

export function unauthorizedFailure(): ProjectsActionFailure {
  return {
    success: false,
    error: ERROR_MESSAGES.unauthorized,
    code: "unauthorized",
  };
}

export function forbiddenFailure(): ProjectsActionFailure {
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
      return toProjectsActionError(error) as ProjectsActionFailure;
    }
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    return unauthorizedFailure();
  }

  try {
    return { success: true, data: await operation(refreshed.access_token) };
  } catch (error) {
    return toProjectsActionError(error) as ProjectsActionFailure;
  }
}
