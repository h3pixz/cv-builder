import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./redirect-path";

describe("safeRedirectPath", () => {
  it("keeps an internal path with its query", () => {
    expect(safeRedirectPath("/cvs?page=2")).toBe("/cvs?page=2");
  });

  it("falls back for an empty or missing value", () => {
    expect(safeRedirectPath(undefined)).toBe("/");
    expect(safeRedirectPath("")).toBe("/");
  });

  it("falls back for external and protocol-relative paths", () => {
    expect(safeRedirectPath("https://evil.example")).toBe("/");
    expect(safeRedirectPath("//evil.example")).toBe("/");
    expect(safeRedirectPath("/\\evil.example")).toBe("/");
  });

  it("falls back for header-injection characters", () => {
    expect(safeRedirectPath("/cvs\r\nLocation: https://evil.example")).toBe("/");
  });

  it("falls back for guest-only pages", () => {
    expect(safeRedirectPath("/sign-in")).toBe("/");
    expect(safeRedirectPath("/sign-up?next=/cvs")).toBe("/");
    expect(safeRedirectPath("/forgot-password")).toBe("/");
  });

  it("uses a custom fallback", () => {
    expect(safeRedirectPath(undefined, "/cvs")).toBe("/cvs");
  });
});
