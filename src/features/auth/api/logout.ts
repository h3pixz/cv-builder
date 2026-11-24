"use server"

import { redirect } from "next/navigation"
import { clearSession } from "@/shared/api"

export async function logout(): Promise<void> {
  await clearSession()

  redirect("/sign-in")
}
