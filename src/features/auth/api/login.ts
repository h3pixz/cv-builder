"use server"

import { redirect } from "next/navigation"
import { gqlRequest } from "@/shared/api/graphql"
import { saveSession } from "@/shared/api/session"
import { VERIFY_EMAIL_ROUTE } from "@/shared/config"
import { safeRedirectPath } from "@/shared/helpers/redirect-path"
import { toFormError, type FormActionResult } from "./action-result"
import { LoginMutation } from "./documents"

export async function login(
  email: string,
  password: string,
  next?: string,
): Promise<FormActionResult> {
  let isVerified = false

  try {
    const data = await gqlRequest(LoginMutation, {
      auth: { email, password },
    })

    await saveSession(data.login)
    isVerified = data.login.user.is_verified
  } catch (error) {
    return toFormError(error)
  }

  if (!isVerified) {
    redirect(VERIFY_EMAIL_ROUTE)
  }

  redirect(safeRedirectPath(next))
}
