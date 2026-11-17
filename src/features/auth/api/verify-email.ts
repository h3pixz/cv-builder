"use server"

import { redirect } from "next/navigation"
import {
  ERROR_MESSAGES,
  getGraphQLErrorCode,
  gqlRequest,
} from "@/shared/api/graphql"
import { getSession, refreshSession } from "@/shared/api/session"
import { toFormError, type FormActionResult } from "./action-result"
import { SendVerificationMutation, VerifyMailMutation } from "./documents"
import { getRequestOrigin } from "./request-origin"
import { decodeTokenEmail } from "./token-payload"

async function requestVerification(otp: string, accessToken: string) {
  await gqlRequest(VerifyMailMutation, { mail: { otp } }, { accessToken })
}

async function requestResend(email: string, accessToken: string) {
  const origin = await getRequestOrigin()

  await gqlRequest(
    SendVerificationMutation,
    { email },
    { accessToken, origin },
  )
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

export async function resendVerification(): Promise<FormActionResult> {
  const session = await getSession()

  if (!session) {
    return sessionExpired
  }

  const email = decodeTokenEmail(session.access_token)

  if (!email) {
    return sessionExpired
  }

  try {
    await requestResend(email, session.access_token)
  } catch (error) {
    if (getGraphQLErrorCode(error) !== "unauthorized") {
      return toFormError(error)
    }

    const refreshed = await refreshSession()

    if (!refreshed) {
      return sessionExpired
    }

    try {
      await requestResend(email, refreshed.access_token)
    } catch (retryError) {
      return toFormError(retryError)
    }
  }

  return { success: true }
}
