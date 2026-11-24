import { beforeEach, describe, expect, it, vi } from "vitest"
import { login } from "./login"

const { gqlRequest, saveSession, redirect } = vi.hoisted(() => ({
  gqlRequest: vi.fn(),
  saveSession: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))

vi.mock("@/shared/api/graphql/graphql", () => ({ gqlRequest }))
vi.mock("@/shared/api/session/session", () => ({ saveSession }))
vi.mock("next/navigation", () => ({ redirect }))

const user = {
  id: "user-1",
  email: "user@example.com",
  is_verified: true,
  role: "Employee",
}

const loginResult = {
  user,
  access_token: "access-1",
  refresh_token: "refresh-1",
}

beforeEach(() => {
  gqlRequest.mockReset()
  saveSession.mockReset()
  redirect.mockClear()
})

describe("login", () => {
  it("saves the session and goes home", async () => {
    gqlRequest.mockResolvedValueOnce({ login: loginResult })

    await expect(login("user@example.com", "secret")).rejects.toThrow(
      "redirect:/",
    )

    expect(gqlRequest).toHaveBeenCalledWith(expect.anything(), {
      auth: { email: "user@example.com", password: "secret" },
    })
    expect(saveSession).toHaveBeenCalledWith(loginResult)
  })

  it("returns to the requested page", async () => {
    gqlRequest.mockResolvedValueOnce({ login: loginResult })

    await expect(
      login("user@example.com", "secret", "/cvs?page=2"),
    ).rejects.toThrow("redirect:/cvs?page=2")
  })

  it("ignores an external redirect target", async () => {
    gqlRequest.mockResolvedValueOnce({ login: loginResult })

    await expect(
      login("user@example.com", "secret", "https://evil.example"),
    ).rejects.toThrow("redirect:/")
  })

  it("sends unverified users to email verification", async () => {
    gqlRequest.mockResolvedValueOnce({
      login: { ...loginResult, user: { ...user, is_verified: false } },
    })

    await expect(login("user@example.com", "secret", "/cvs")).rejects.toThrow(
      "redirect:/verify-email",
    )
  })

  it("returns a form error for invalid credentials", async () => {
    gqlRequest.mockRejectedValueOnce({
      response: { errors: [{ message: "invalidCredentials" }] },
    })

    await expect(login("user@example.com", "wrong")).resolves.toEqual({
      success: false,
      error: "Invalid email or password",
      code: "invalidCredentials",
    })

    expect(saveSession).not.toHaveBeenCalled()
    expect(redirect).not.toHaveBeenCalled()
  })
})
