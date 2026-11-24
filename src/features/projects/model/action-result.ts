import {
  getGraphQLErrorCode,
  getGraphQLErrorMessage,
  type GraphQLErrorCode,
} from "@/shared/api";

export type ProjectField =
  | "name"
  | "domain"
  | "startDate"
  | "endDate"
  | "description";

export type ProjectsActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
      code: GraphQLErrorCode | null;
      field?: ProjectField;
    };

export function toProjectsActionError(error: unknown): ProjectsActionResult {
  return {
    success: false,
    error: getGraphQLErrorMessage(error),
    code: getGraphQLErrorCode(error),
  };
}
