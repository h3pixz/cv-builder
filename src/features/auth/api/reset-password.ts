"use server"

import { redirect } from "next/navigation"
import { gqlRequest } from "@/shared/api/graphql"
import { saveSession } from "@/shared/api/session"
import { toFormError, type FormActionResult } from "./action-result"
import { LoginMutation, ResetPasswordMutation } from "./documents"

type ResetPasswordInput = {
  token: string
  newPassword: string
  confirmPassword: string
}

function decodeEmail(token: string): string | null {
  try {
    const payload = token.split(".")[1]

    if (!payload) {
      return null
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { email?: unknown }

    return typeof data.email === "string" ? data.email : null
  } catch {
    return null
  }
}

export async function resetPassword({
  token,
  newPassword,
  confirmPassword,
}: ResetPasswordInput): Promise<FormActionResult> {
  try {
    await gqlRequest(
      ResetPasswordMutation,
      { auth: { newPassword, confirmPassword } },
      { accessToken: token },
    )
  } catch (error) {
    return toFormError(error)
  }

  // The reset link token carries the account email; reuse it to sign the user
  // in right after the password change.
  const email = decodeEmail(token)
  let signedIn = false

  if (email) {
    try {
      const data = await gqlRequest(LoginMutation, {
        auth: { email, password: newPassword },
      })

      await saveSession(data.login)
      signedIn = true
    } catch {
      signedIn = false
    }
  }

  redirect(signedIn ? "/" : "/sign-in")
}
