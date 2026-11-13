import {
  getGraphQLErrorCode,
  getGraphQLErrorMessage,
  type GraphQLErrorCode,
} from "@/shared/api/graphql"

export type FormActionResult =
  | { success: true }
  | { success: false; error: string; code: GraphQLErrorCode | null }

export function toFormError(error: unknown): FormActionResult {
  return {
    success: false,
    error: getGraphQLErrorMessage(error),
    code: getGraphQLErrorCode(error),
  }
}
