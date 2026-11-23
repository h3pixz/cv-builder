import { describe, expect, it } from "vitest";

import { toProjectsActionError } from "./action-result";

function graphQLError(message: string) {
  return { response: { errors: [{ message }] } };
}

describe("toProjectsActionError", () => {
  it("falls back to a friendly message for unknown errors", () => {
    expect(toProjectsActionError(graphQLError("weirdBackendCode"))).toEqual({
      success: false,
      error: "Something went wrong. Please try again later",
      code: null,
    });
  });
});
