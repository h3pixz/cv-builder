import { describe, expect, it } from "vitest";

import { toPositionsActionError } from "./action-result";
import { POSITION_MESSAGES } from "./position-schema";

function graphQLError(message: string) {
  return { response: { errors: [{ message }] } };
}

describe("toPositionsActionError", () => {
  it("maps relation errors to the in-use message", () => {
    expect(toPositionsActionError(graphQLError("positionHasRelations"))).toEqual(
      {
        success: false,
        error: POSITION_MESSAGES.inUse,
        code: null,
      },
    );
  });

  it("maps a foreign key error to the in-use message", () => {
    expect(
      toPositionsActionError(graphQLError("foreignKeyViolation")),
    ).toEqual({
      success: false,
      error: POSITION_MESSAGES.inUse,
      code: null,
    });
  });

  it("falls back to a friendly message for unknown errors", () => {
    expect(toPositionsActionError(graphQLError("weirdBackendCode"))).toEqual({
      success: false,
      error: "Something went wrong. Please try again later",
      code: null,
    });
  });
});
