import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { authedGqlRequest, authedGqlRequestWithRefresh } from "./authed-request";

const { gqlRequest, getSession, refreshSession, clearSession, redirect } =
  vi.hoisted(() => ({
    gqlRequest: vi.fn(),
    getSession: vi.fn(),
    refreshSession: vi.fn(),
    clearSession: vi.fn(),
    redirect: vi.fn((path: string) => {
      throw new Error(`redirect:${path}`);
    }),
  }));

vi.mock("./client", () => ({ gqlRequest }));
vi.mock("../session", () => ({ getSession, refreshSession, clearSession }));
vi.mock("next/navigation", () => ({ redirect }));

const document = {} as TypedDocumentNode<
  { ok: boolean },
  Record<string, never>
>;
const session = { access_token: "access-1", refresh_token: "refresh-1" };
const fresh = { access_token: "access-2", refresh_token: "refresh-2" };

function unauthorized() {
  return {
    response: {
      errors: [
        {
          message: "unauthorized",
          extensions: { code: "UNAUTHORIZED" },
        },
      ],
    },
  };
}

beforeEach(() => {
  gqlRequest.mockReset();
  getSession.mockReset();
  refreshSession.mockReset();
  clearSession.mockReset();
  redirect.mockClear();
});

describe("authedGqlRequest", () => {
  it("redirects to sign in without a session", async () => {
    getSession.mockResolvedValue(null);

    await expect(authedGqlRequest(document)).rejects.toThrow(
      "redirect:/sign-in",
    );

    expect(gqlRequest).not.toHaveBeenCalled();
  });

  it("sends the access token", async () => {
    getSession.mockResolvedValue(session);
    gqlRequest.mockResolvedValueOnce({ ok: true });

    await expect(authedGqlRequest(document)).resolves.toEqual({ ok: true });

    expect(gqlRequest).toHaveBeenCalledWith(document, undefined, {
      accessToken: "access-1",
    });
  });

  it("redirects when the access token is rejected", async () => {
    getSession.mockResolvedValue(session);
    gqlRequest.mockRejectedValueOnce(unauthorized());

    await expect(authedGqlRequest(document)).rejects.toThrow(
      "redirect:/sign-in",
    );
  });

  it("rethrows regular errors", async () => {
    getSession.mockResolvedValue(session);
    gqlRequest.mockRejectedValueOnce(new Error("boom"));

    await expect(authedGqlRequest(document)).rejects.toThrow("boom");

    expect(redirect).not.toHaveBeenCalled();
  });
});

describe("authedGqlRequestWithRefresh", () => {
  it("returns data without refreshing when the token works", async () => {
    getSession.mockResolvedValue(session);
    gqlRequest.mockResolvedValueOnce({ ok: true });

    await expect(
      authedGqlRequestWithRefresh(document),
    ).resolves.toEqual({ ok: true });

    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("refreshes the session and retries once", async () => {
    getSession.mockResolvedValue(session);
    refreshSession.mockResolvedValue(fresh);
    gqlRequest
      .mockRejectedValueOnce(unauthorized())
      .mockResolvedValueOnce({ ok: true });

    await expect(
      authedGqlRequestWithRefresh(document),
    ).resolves.toEqual({ ok: true });

    expect(refreshSession).toHaveBeenCalledOnce();
    expect(clearSession).not.toHaveBeenCalled();
    expect(gqlRequest).toHaveBeenLastCalledWith(document, undefined, {
      accessToken: "access-2",
    });
  });

  it("clears the session and redirects when refresh fails", async () => {
    getSession.mockResolvedValue(session);
    refreshSession.mockResolvedValue(null);
    gqlRequest.mockRejectedValueOnce(unauthorized());

    await expect(authedGqlRequestWithRefresh(document)).rejects.toThrow(
      "redirect:/sign-in",
    );

    expect(clearSession).toHaveBeenCalledOnce();
  });

  it("clears the session and redirects when the retry is rejected", async () => {
    getSession.mockResolvedValue(session);
    refreshSession.mockResolvedValue(fresh);
    gqlRequest
      .mockRejectedValueOnce(unauthorized())
      .mockRejectedValueOnce(unauthorized());

    await expect(authedGqlRequestWithRefresh(document)).rejects.toThrow(
      "redirect:/sign-in",
    );

    expect(clearSession).toHaveBeenCalledOnce();
  });

  it("rethrows regular errors without refreshing", async () => {
    getSession.mockResolvedValue(session);
    gqlRequest.mockRejectedValueOnce(new Error("boom"));

    await expect(authedGqlRequestWithRefresh(document)).rejects.toThrow(
      "boom",
    );

    expect(refreshSession).not.toHaveBeenCalled();
  });
});
