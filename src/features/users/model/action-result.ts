import {
  getGraphQLErrorCode,
  getGraphQLErrorMessage,
  type GraphQLErrorCode,
} from "@/shared/api";

export type UsersActionResult =
  | { success: true }
  | { success: false; error: string; code: GraphQLErrorCode | null };

export type AvatarUploadResult =
  | { success: true; url: string }
  | { success: false; error: string; code: GraphQLErrorCode | null };

export function toUsersActionError(error: unknown): UsersActionResult {
  return {
    success: false,
    error: getGraphQLErrorMessage(error),
    code: getGraphQLErrorCode(error),
  };
}
