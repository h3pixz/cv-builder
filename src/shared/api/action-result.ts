import {
  getGraphQLErrorCode,
  getGraphQLErrorMessage,
  type GraphQLErrorCode,
} from "./errors/errors";

export type ActionResult =
  | { success: true }
  | { success: false; error: string; code: GraphQLErrorCode | null };

export function toActionError(error: unknown): ActionResult {
  return {
    success: false,
    error: getGraphQLErrorMessage(error),
    code: getGraphQLErrorCode(error),
  };
}
