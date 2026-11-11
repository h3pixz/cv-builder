"use client"

import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { PasswordInput } from "@/shared/ui/input"

export function ResetPasswordForm() {
  return (
    <form
      className="w-full"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="w-full">
        <label htmlFor="newPassword" className="sr-only">
          New password
        </label>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          autoComplete="new-password"
          placeholder="New password"
          required
          className="h-11 pl-4 text-sm"
        />
      </div>

      <div className="mt-9 w-full">
        <label htmlFor="confirmPassword" className="sr-only">
          Confirm password
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm password"
          required
          className="h-11 pl-4 text-sm"
        />
      </div>

      <div className="mt-9 flex justify-center">
        <Button
          type="submit"
          variant="primary"
          className="h-12 w-30 text-xs font-semibold tracking-wider"
        >
          Submit
        </Button>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/sign-in"
          className="text-xs font-semibold tracking-wider text-text-secondary uppercase transition-colors hover:text-foreground"
        >
          Go to sign in
        </Link>
      </div>
    </form>
  )
}
