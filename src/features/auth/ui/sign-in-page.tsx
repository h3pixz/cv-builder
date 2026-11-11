import { AuthTabs } from "./components/auth-tabs"
import { SignInForm } from "./components/sign-in-form"

export function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthTabs active="sign-in" />

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-normal tracking-tight">
              Welcome back
            </h1>
            <p className="text-base text-text-secondary">
              Hello again! Sign in to continue
            </p>
          </div>

          <SignInForm />
        </div>
      </main>
    </div>
  )
}
