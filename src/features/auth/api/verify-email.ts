"use server"

import { redirect } from "next/navigation"
import {
  ERROR_MESSAGES,
  getGraphQLErrorCode,
  gqlRequest,
} from "@/shared/api/graphql"
import { getSession, refreshSession } from "@/shared/api/session"
import { toFormError, type FormActionResult } from "./action-result"
import { VerifyMailMutation } from "./documents"

async function requestVerification(otp: string, accessToken: string) {
  await gqlRequest(VerifyMailMutation, { mail: { otp } }, { accessToken })
}

const sessionExpired: FormActionResult = {
  success: false,
  error: ERROR_MESSAGES.unauthorized,
  code: "unauthorized",
}

export async function verifyEmail(otp: string): Promise<FormActionResult> {
  const session = await getSession()

  if (!session) {
    return sessionExpired
  }

  try {
    await requestVerification(otp, session.access_token)
  } catch (error) {
    if (getGraphQLErrorCode(error) !== "unauthorized") {
      return toFormError(error)
    }

    const refreshed = await refreshSession()

    if (!refreshed) {
      return sessionExpired
    }

    try {
      await requestVerification(otp, refreshed.access_token)
    } catch (retryError) {
      return toFormError(retryError)
    }
  }

  redirect("/")
}
