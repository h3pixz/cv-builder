import "server-only";

import {
  ERROR_MESSAGES,
  getSession,
  isUnauthorizedError,
  refreshSession,
} from "@/shared/api";

import {
  toSkillsActionError,
  type SkillsActionResult,
} from "../model/action-result";

export type SkillsActionFailure = Extract<
  SkillsActionResult,
  { success: false }
>;

export type AuthedResult<T> = { success: true; data: T } | SkillsActionFailure;

export function unauthorizedFailure(): SkillsActionFailure {
  return {
    success: false,
    error: ERROR_MESSAGES.unauthorized,
    code: "unauthorized",
  };
}

export function forbiddenFailure(): SkillsActionFailure {
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
      return toSkillsActionError(error) as SkillsActionFailure;
    }
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    return unauthorizedFailure();
  }

  try {
    return { success: true, data: await operation(refreshed.access_token) };
  } catch (error) {
    return toSkillsActionError(error) as SkillsActionFailure;
  }
}
