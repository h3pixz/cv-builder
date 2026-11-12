import { ResetPasswordForm } from "./components/reset-password-form"

export function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-normal tracking-tight">
              Reset password
            </h1>
            <p className="text-base text-text-secondary">
              Here you should write a new password and confirm it
            </p>
          </div>

          <ResetPasswordForm />
        </div>
      </main>
    </div>
  )
}
