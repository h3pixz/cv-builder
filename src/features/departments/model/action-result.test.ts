import { describe, expect, it } from "vitest";

import { toDepartmentsActionError } from "./action-result";
import { DEPARTMENT_MESSAGES } from "./department-schema";

function graphQLError(message: string) {
  return { response: { errors: [{ message }] } };
}

describe("toDepartmentsActionError", () => {
  it("maps relation errors to the in-use message", () => {
    expect(
      toDepartmentsActionError(graphQLError("departmentHasRelations")),
    ).toEqual({
      success: false,
      error: DEPARTMENT_MESSAGES.inUse,
      code: null,
    });
  });

  it("maps a foreign key error to the in-use message", () => {
    expect(
      toDepartmentsActionError(graphQLError("foreignKeyViolation")),
    ).toEqual({
      success: false,
      error: DEPARTMENT_MESSAGES.inUse,
      code: null,
    });
  });

  it("falls back to a friendly message for unknown errors", () => {
    expect(toDepartmentsActionError(graphQLError("weirdBackendCode"))).toEqual({
      success: false,
      error: "Something went wrong. Please try again later",
      code: null,
    });
  });
});
