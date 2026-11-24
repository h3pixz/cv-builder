import {
  getGraphQLErrorCode,
  getGraphQLErrorMessage,
  type GraphQLErrorCode,
} from "@/shared/api";

export type LanguageField = "name" | "mastery" | "iso2" | "nativeName";

export type LanguagesActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
      code: GraphQLErrorCode | null;
      field?: LanguageField;
    };

export function toLanguagesActionError(error: unknown): LanguagesActionResult {
  return {
    success: false,
    error: getGraphQLErrorMessage(error),
    code: getGraphQLErrorCode(error),
  };
}
