"use client"

import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { Input, PasswordInput } from "@/shared/ui/input"

export function SignInForm() {
  return (
    <form
      className="w-full space-y-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="w-full">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          required
          className="h-11 px-4 text-sm"
        />
      </div>

      <div className="w-full">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          required
          className="h-11 pl-4 text-sm"
        />
      </div>

      <div className="flex justify-center pt-5">
        <Button
          type="submit"
          variant="primary"
          className="h-11 w-44 text-xs font-semibold tracking-wider"
        >
          Sign in
        </Button>
      </div>

      <div className="pt-4 text-center">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold tracking-wider text-text-secondary uppercase transition-colors hover:text-foreground"
        >
          Forgot password
        </Link>
      </div>
    </form>
  )
}
