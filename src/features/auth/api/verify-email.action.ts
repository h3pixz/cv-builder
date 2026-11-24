"use server";
import { getSession } from "@/shared/api";

export async function verifyEmailAction() {
  return await getSession();
}
