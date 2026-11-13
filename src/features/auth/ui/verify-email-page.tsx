import { redirect } from "next/navigation"
import { getSession } from "@/shared/api"
import { VerifyEmailForm } from "./components/verify-email-form"

export async function VerifyEmailPage() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-normal tracking-tight">
              Email verification
            </h1>
            <p className="text-base text-text-secondary">
              Enter the verification code we sent to your email.
            </p>
          </div>

          <VerifyEmailForm />
        </div>
      </main>
    </div>
  )
}
