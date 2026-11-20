import {
  getGraphQLErrorCode,
  getGraphQLErrorMessage,
  type GraphQLErrorCode,
} from "@/shared/api";

export type SkillsActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
      code: GraphQLErrorCode | null;
      /** The field the error belongs to, so forms can show it inline. */
      field?: "name" | "categoryId" | "mastery";
    };

export function toSkillsActionError(error: unknown): SkillsActionResult {
  return {
    success: false,
    error: getGraphQLErrorMessage(error),
    code: getGraphQLErrorCode(error),
  };
}
