"use server"

import { redirect } from "next/navigation"
import { gqlRequest } from "@/shared/api/graphql"
import { saveSession } from "@/shared/api/session"
import { toFormError, type FormActionResult } from "./action-result"
import { SignupMutation } from "./documents"
import { getRequestOrigin } from "./request-origin"

export async function signup(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<FormActionResult> {
  try {
    const origin = await getRequestOrigin()
    const data = await gqlRequest(
      SignupMutation,
      { auth: { email, password, confirmPassword } },
      { origin },
    )

    await saveSession(data.signup)
  } catch (error) {
    return toFormError(error)
  }

  redirect("/verify-email")
}
