"use server"

import { redirect } from "next/navigation"
import { gqlRequest } from "@/shared/api/graphql/graphql"
import { saveSession } from "@/shared/api/session/session"
import { toFormError, type FormActionResult } from "./action-result"
import { LoginMutation, ResetPasswordMutation } from "./documents"
import { decodeTokenEmail } from "./token-payload"

type ResetPasswordInput = {
  token: string
  newPassword: string
  confirmPassword: string
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

  const email = decodeTokenEmail(token)
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
