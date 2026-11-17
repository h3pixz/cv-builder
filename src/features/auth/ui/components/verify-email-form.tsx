"use client"

import { FormEvent, useState } from "react"
import { Button } from "@/shared/ui/button"
import { CodeInput } from "@/shared/ui/input"
import { toast } from "@/shared/ui/toast"
import { resendVerification, verifyEmail } from "../../api/verify-email"
import { AuthLink } from "./auth-link"

const CODE_LENGTH = 6

function getCodeError(code: string): string | null {
  if (code.length === 0) {
    return "Verification code is required"
  }

  if (code.length !== CODE_LENGTH) {
    return "Please enter a valid 6-digit code"
  }

  return null
}

export function VerifyEmailForm() {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = getCodeError(code)

    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsSubmitting(true)

    const result = await verifyEmail(code)

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error)
    }
  }

  function handleCodeChange(value: string) {
    setCode(value)

    if (error) {
      setError(null)
    }
  }

  async function handleResend() {
    setIsResending(true)

    const result = await resendVerification()

    setIsResending(false)

    if (result.success) {
      toast.add({
        type: "success",
        title: "Code sent",
        description: "Check your inbox for a new verification code",
      })
    } else {
      toast.add({
        type: "error",
        title: "Could not send the email",
        description: result.error,
      })
    }
  }

  return (
    <form
      className="flex w-full flex-col items-center"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="mb-8 flex w-full flex-col items-center">
        <CodeInput
          value={code}
          onChange={handleCodeChange}
          length={CODE_LENGTH}
          submitOnComplete={false}
          disabled={isSubmitting}
          variant={error ? "error" : "default"}
        />
        {error && (
          <p role="alert" className="mt-3 text-xs text-error">
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="h-11 w-44 text-xs font-semibold tracking-wider"
      >
        Confirm
      </Button>

      <div className="mt-6 flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-text-secondary">
          Didn&apos;t receive the code?{" "}
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={isResending}
            className="h-auto px-1 py-0 text-xs font-semibold tracking-wider text-text-secondary uppercase hover:border-transparent hover:bg-transparent hover:text-foreground"
          >
            {isResending ? "Sending..." : "Send again"}
          </Button>
        </p>
        <AuthLink href="/">Later</AuthLink>
      </div>
    </form>
  )
}
