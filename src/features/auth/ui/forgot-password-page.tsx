import { ForgotPasswordForm } from "./components/forgot-password-form"

export function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-normal tracking-tight">
              Forgot password
            </h1>
            <p className="text-base">
              We will send you an email with further instructions
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </main>
    </div>
  )
}
