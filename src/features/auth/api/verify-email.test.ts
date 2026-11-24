import { beforeEach, describe, expect, it, vi } from "vitest"
import { resendVerification } from "./verify-email"

const { gqlRequest, getSession, refreshSession, getRequestOrigin } = vi.hoisted(
  () => ({
    gqlRequest: vi.fn(),
    getSession: vi.fn(),
    refreshSession: vi.fn(),
    getRequestOrigin: vi.fn(),
  }),
)

vi.mock("@/shared/api/graphql/graphql", () => ({ gqlRequest }))
vi.mock("@/shared/api/session/session", () => ({ getSession, refreshSession }))
vi.mock("@/shared/api/request-origin", () => ({ getRequestOrigin }))
vi.mock("next/navigation", () => ({ redirect: vi.fn() }))

const email = "user@example.com"

function makeAccessToken(payload: object): string {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url")

  return `${encode({ alg: "HS256" })}.${encode(payload)}.signature`
}

function makeSession(payload: object = { email }) {
  return {
    access_token: makeAccessToken(payload),
    refresh_token: "refresh-1",
  }
}

const unauthorizedError = {
  response: { errors: [{ message: "unauthorized" }] },
}

beforeEach(() => {
  gqlRequest.mockReset()
  getSession.mockReset()
  refreshSession.mockReset()
  getRequestOrigin.mockReset()
})

describe("resendVerification", () => {
  it("sends a new code to the signed-in email", async () => {
    const session = makeSession()
    gqlRequest.mockResolvedValueOnce({ sendVerification: null })
    getSession.mockResolvedValueOnce(session)
    getRequestOrigin.mockResolvedValueOnce("http://localhost:3000")

    await expect(resendVerification()).resolves.toEqual({ success: true })

    expect(gqlRequest).toHaveBeenCalledWith(expect.anything(), { email }, {
      accessToken: session.access_token,
      origin: "http://localhost:3000",
    })
  })

  it("refreshes the session and retries once", async () => {
    const session = makeSession()
    const refreshed = {
      access_token: makeAccessToken({ email, sub: "user-1" }),
      refresh_token: "refresh-2",
    }
    gqlRequest.mockRejectedValueOnce(unauthorizedError)
    gqlRequest.mockResolvedValueOnce({ sendVerification: null })
    getSession.mockResolvedValueOnce(session)
    refreshSession.mockResolvedValueOnce(refreshed)
    getRequestOrigin.mockResolvedValue("http://localhost:3000")

    await expect(resendVerification()).resolves.toEqual({ success: true })

    expect(gqlRequest).toHaveBeenCalledTimes(2)
    expect(gqlRequest).toHaveBeenLastCalledWith(
      expect.anything(),
      { email },
      { accessToken: refreshed.access_token, origin: "http://localhost:3000" },
    )
  })

  it("returns a session error when the refresh fails", async () => {
    gqlRequest.mockRejectedValueOnce(unauthorizedError)
    getSession.mockResolvedValueOnce(makeSession())
    refreshSession.mockResolvedValueOnce(null)

    await expect(resendVerification()).resolves.toEqual({
      success: false,
      error: "Your session has expired. Please sign in again",
      code: "unauthorized",
    })

    expect(gqlRequest).toHaveBeenCalledOnce()
  })

  it("returns a session error without a session", async () => {
    getSession.mockResolvedValueOnce(null)

    await expect(resendVerification()).resolves.toEqual({
      success: false,
      error: "Your session has expired. Please sign in again",
      code: "unauthorized",
    })

    expect(gqlRequest).not.toHaveBeenCalled()
  })

  it("returns a session error when the token has no email", async () => {
    getSession.mockResolvedValueOnce(makeSession({ sub: "user-1" }))

    await expect(resendVerification()).resolves.toEqual({
      success: false,
      error: "Your session has expired. Please sign in again",
      code: "unauthorized",
    })

    expect(gqlRequest).not.toHaveBeenCalled()
  })

  it("returns a form error when the email cannot be sent", async () => {
    gqlRequest.mockRejectedValueOnce({
      response: { errors: [{ message: "failedToSendEmail" }] },
    })
    getSession.mockResolvedValueOnce(makeSession())
    getRequestOrigin.mockResolvedValueOnce("http://localhost:3000")

    await expect(resendVerification()).resolves.toEqual({
      success: false,
      error: "Unable to send the email. Please try again later",
      code: "failedToSendEmail",
    })
  })
})
