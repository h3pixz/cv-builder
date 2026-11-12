"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/ui/button"
import { Input, PasswordInput } from "@/shared/ui/input"
import { signInSchema, type SignInValues } from "../../model/sign-in-schema"

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  })

  const emailError = errors.email?.message
  const passwordError = errors.password?.message

  return (
    <form
      className="w-full space-y-4"
      noValidate
      onSubmit={handleSubmit(() => undefined)}
    >
      <div className="w-full">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          variant={emailError ? "error" : "default"}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "email-error" : undefined}
          className="h-11 px-4 text-sm"
          {...register("email")}
        />
        {emailError && (
          <p id="email-error" role="alert" className="mt-1 text-xs text-error">
            {emailError}
          </p>
        )}
      </div>

      <div className="w-full">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Password"
          variant={passwordError ? "error" : "default"}
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? "password-error" : undefined}
          className="h-11 pl-4 text-sm"
          {...register("password")}
        />
        {passwordError && (
          <p id="password-error" role="alert" className="mt-1 text-xs text-error">
            {passwordError}
          </p>
        )}
      </div>

      <div className="flex justify-center pt-5">
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid}
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
