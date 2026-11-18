import { describe, expect, it, vi } from "vitest";
import { getTokenSubject, isTokenExpired } from "./jwt";

function encode(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function token(payload: object) {
  return `${encode({ alg: "none" })}.${encode(payload)}.signature`;
}

function inSeconds(seconds: number) {
  return Math.floor(Date.now() / 1000) + seconds;
}

describe("getTokenSubject", () => {
  it("returns the user id from the payload", () => {
    expect(getTokenSubject(token({ sub: "user-1" }))).toBe("user-1");
  });

  it("stringifies a numeric subject", () => {
    expect(getTokenSubject(token({ sub: 42 }))).toBe("42");
  });

  it("returns null when there is no subject", () => {
    expect(getTokenSubject(token({ exp: inSeconds(60) }))).toBeNull();
  });

  it("returns null for a malformed token", () => {
    expect(getTokenSubject("not-a-jwt")).toBeNull();
  });
});

describe("isTokenExpired", () => {
  it("returns false for a token that expires later", () => {
    expect(isTokenExpired(token({ exp: inSeconds(60) }))).toBe(false);
  });

  it("returns true for an expired token", () => {
    expect(isTokenExpired(token({ exp: inSeconds(-1) }))).toBe(true);
  });

  it("treats tokens inside the skew window as expired", () => {
    expect(isTokenExpired(token({ exp: inSeconds(10) }), 30)).toBe(true);
  });

  it("returns true for a malformed token", () => {
    expect(isTokenExpired("not-a-jwt")).toBe(true);
    expect(isTokenExpired("header.%%%.signature")).toBe(true);
  });

  it("returns false when the payload has no exp", () => {
    expect(isTokenExpired(token({ sub: "user-1" }))).toBe(false);
  });

  it("uses the current time", () => {
    const now = Math.floor(Date.now() / 1000);
    vi.spyOn(Date, "now").mockReturnValue(now * 1000);

    expect(isTokenExpired(token({ exp: now }))).toBe(true);
    expect(isTokenExpired(token({ exp: now + 1 }))).toBe(false);

    vi.restoreAllMocks();
  });
});
