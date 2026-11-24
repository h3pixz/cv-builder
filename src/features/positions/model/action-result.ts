import {
  getGraphQLErrorCode,
  getGraphQLErrorMessage,
  type GraphQLErrorCode,
} from "@/shared/api";

import { POSITION_MESSAGES } from "./position-schema";

export type PositionField = "name";

export type PositionsActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
      code: GraphQLErrorCode | null;
      field?: PositionField;
    };

type GraphQLErrorLike = {
  response?: {
    errors?: { message?: unknown }[];
  };
};

const POSITION_IN_USE_PATTERN =
  /in.?use|has.?relation|foreign.?key|cannot be deleted|referenc|assigned|position.*(employee|department|project)/i;

function getRawErrorMessage(error: unknown): string | null {
  const message = (error as GraphQLErrorLike | null)?.response?.errors?.[0]
    ?.message;

  return typeof message === "string" ? message : null;
}

export function toPositionsActionError(
  error: unknown,
): PositionsActionResult {
  const code = getGraphQLErrorCode(error);

  if (!code) {
    const raw = getRawErrorMessage(error);

    if (raw && POSITION_IN_USE_PATTERN.test(raw)) {
      return { success: false, error: POSITION_MESSAGES.inUse, code: null };
    }
  }

  return {
    success: false,
    error: getGraphQLErrorMessage(error),
    code,
  };
}
