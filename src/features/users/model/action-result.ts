import type { GraphQLErrorCode } from "@/shared/api";

export type AvatarUploadResult =
  | { success: true; url: string }
  | { success: false; error: string; code: GraphQLErrorCode | null };
