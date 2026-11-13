"use server"

import { redirect } from "next/navigation"
import { gqlRequest } from "@/shared/api/graphql"
import { saveSession } from "@/shared/api/session"
import { toFormError, type FormActionResult } from "./action-result"
import { LoginMutation } from "./documents"

export async function login(
  email: string,
  password: string,
): Promise<FormActionResult> {
  try {
    const data = await gqlRequest(LoginMutation, {
      auth: { email, password },
    })

    await saveSession(data.login)
  } catch (error) {
    return toFormError(error)
  }

  redirect("/")
}
