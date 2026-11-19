import "server-only";

import { toActionError, type ActionResult } from "./action-result";
import { ERROR_MESSAGES, isUnauthorizedError } from "./errors/errors";
import { getSession, refreshSession } from "./session/session";

export type ActionFailure = Extract<ActionResult, { success: false }>;

export type AuthedResult<T> = { success: true; data: T } | ActionFailure;

export function unauthorizedFailure(): ActionFailure {
  return {
    success: false,
    error: ERROR_MESSAGES.unauthorized,
    code: "unauthorized",
  };
}

export function forbiddenFailure(): ActionFailure {
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
      return toActionError(error) as ActionFailure;
    }
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    return unauthorizedFailure();
  }

  try {
    return {
      success: true,
      data: await operation(refreshed.access_token),
    };
  } catch (error) {
    return toActionError(error) as ActionFailure;
  }
}
