import { AuthTabs } from "./components/auth-tabs"
import { SignUpForm } from "./components/sign-up-form"

export function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthTabs active="sign-up" />

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

          <SignUpForm />
        </div>
      </main>
    </div>
  )
}
