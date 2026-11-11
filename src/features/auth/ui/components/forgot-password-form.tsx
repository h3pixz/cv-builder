"use client"

import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

export function ForgotPasswordForm() {
  return (
    <form
      className="flex w-full flex-col items-center"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="mb-10 w-full text-left">
        <label
          htmlFor="email"
          className="mb-1 ml-0.5 block text-xs text-text-secondary"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 px-4 text-sm"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="h-11 w-60 text-xs font-semibold tracking-wider"
      >
        Reset Password
      </Button>

      <div className="mt-2 text-center">
        <Link
          href="/sign-in"
          className="inline-block text-xs font-semibold tracking-wider text-text-secondary uppercase transition-colors hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
