import { describe, expect, it } from "vitest";
import {
  getGraphQLErrorCode,
  getGraphQLErrorMessage,
  isUnauthorizedError,
} from "./errors";

function clientError(...messages: string[]) {
  return { response: { errors: messages.map((message) => ({ message })) } };
}

describe("getGraphQLErrorCode", () => {
  it("returns a known backend code", () => {
    expect(getGraphQLErrorCode(clientError("invalidCredentials"))).toBe(
      "invalidCredentials",
    );
  });

  it("returns the first code when several errors are present", () => {
    expect(
      getGraphQLErrorCode(clientError("confirmPasswordMismatch", "invalidEmail")),
    ).toBe("confirmPasswordMismatch");
  });

  it("returns null for an unknown code", () => {
    expect(getGraphQLErrorCode(clientError("unknownCode"))).toBeNull();
  });

  it("returns null without a response", () => {
    expect(getGraphQLErrorCode(new Error("network"))).toBeNull();
    expect(getGraphQLErrorCode(null)).toBeNull();
    expect(getGraphQLErrorCode(undefined)).toBeNull();
  });
});

describe("isUnauthorizedError", () => {
  it("detects the backend unauthorized code", () => {
    expect(isUnauthorizedError(clientError("unauthorized"))).toBe(true);
  });

  it("detects an unauthorized extension code", () => {
    expect(
      isUnauthorizedError({
        response: { errors: [{ message: "denied", extensions: { code: "UNAUTHORIZED" } }] },
      }),
    ).toBe(true);
    expect(
      isUnauthorizedError({
        response: { errors: [{ message: "denied", extensions: { code: "UNAUTHENTICATED" } }] },
      }),
    ).toBe(true);
  });

  it("detects a 401 status", () => {
    expect(isUnauthorizedError({ response: { status: 401 } })).toBe(true);
  });

  it("detects a 401 inside the original error", () => {
    expect(
      isUnauthorizedError({
        response: {
          errors: [
            { message: "denied", extensions: { originalError: { statusCode: 401 } } },
          ],
        },
      }),
    ).toBe(true);
  });

  it("ignores other errors", () => {
    expect(isUnauthorizedError(clientError("invalidCredentials"))).toBe(false);
    expect(isUnauthorizedError(new Error("network"))).toBe(false);
    expect(isUnauthorizedError(null)).toBe(false);
  });
});

describe("getGraphQLErrorMessage", () => {
  it("translates a known code", () => {
    expect(getGraphQLErrorMessage(clientError("invalidCredentials"))).toBe(
      "Invalid email or password",
    );
  });

  it("falls back to a generic message", () => {
    expect(getGraphQLErrorMessage(clientError("unknownCode"))).toBe(
      "Something went wrong. Please try again later",
    );
    expect(getGraphQLErrorMessage(new Error("network"))).toBe(
      "Something went wrong. Please try again later",
    );
  });

  it("uses a custom fallback", () => {
    expect(getGraphQLErrorMessage(new Error("network"), "Sign in failed")).toBe(
      "Sign in failed",
    );
  });
});
