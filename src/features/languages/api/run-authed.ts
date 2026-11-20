import "server-only";

import {
  ERROR_MESSAGES,
  getSession,
  isUnauthorizedError,
  refreshSession,
} from "@/shared/api";

import {
  toLanguagesActionError,
  type LanguagesActionResult,
} from "../model/action-result";

export type LanguagesActionFailure = Extract<
  LanguagesActionResult,
  { success: false }
>;

export type AuthedResult<T> =
  | { success: true; data: T }
  | LanguagesActionFailure;

export function unauthorizedFailure(): LanguagesActionFailure {
  return {
    success: false,
    error: ERROR_MESSAGES.unauthorized,
    code: "unauthorized",
  };
}

export function forbiddenFailure(): LanguagesActionFailure {
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
      return toLanguagesActionError(error) as LanguagesActionFailure;
    }
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    return unauthorizedFailure();
  }

  try {
    return { success: true, data: await operation(refreshed.access_token) };
  } catch (error) {
    return toLanguagesActionError(error) as LanguagesActionFailure;
  }
}
