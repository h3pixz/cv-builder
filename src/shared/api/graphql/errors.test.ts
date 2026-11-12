import { describe, expect, it } from "vitest";
import { getGraphQLErrorCode, getGraphQLErrorMessage } from "./errors";

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
