"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { CodeInput } from "@/shared/ui/input"

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = getCodeError(code)

    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
  }

  function handleCodeChange(value: string) {
    setCode(value)

    if (error) {
      setError(null)
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
        className="h-11 w-44 text-xs font-semibold tracking-wider"
      >
        Confirm
      </Button>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs font-semibold tracking-wider text-text-secondary uppercase transition-colors hover:text-foreground"
        >
          Later
        </Link>
      </div>
    </form>
  )
}
