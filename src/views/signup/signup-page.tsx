import { AuthTabs } from "@/widgets/auth-tabs"
import { SignupForm } from "./signup-form"

export function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthTabs active="signup" />

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-normal tracking-tight">
              Sign up now
            </h1>
            <p className="text-base text-text-secondary">
              Welcome! Sign up to continue
            </p>
          </div>

          <SignupForm />
        </div>
      </main>
    </div>
  )
}
