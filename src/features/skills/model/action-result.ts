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
      field?: "name" | "categoryId" | "mastery";
    };

export function toSkillsActionError(error: unknown): SkillsActionResult {
  return {
    success: false,
    error: getGraphQLErrorMessage(error),
    code: getGraphQLErrorCode(error),
  };
}
