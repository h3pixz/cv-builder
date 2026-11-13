"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/ui/button"
import { Input, PasswordInput } from "@/shared/ui/input"
import { toast } from "@/shared/ui/toast"
import { signInSchema, type SignInValues } from "../../model/sign-in-schema"
import { login } from "../../api/login"
import { AuthLink } from "./auth-link"
import { FormError } from "./form-error"

export function SignInForm() {
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: SignInValues) {
    setFormError(null)

    const result = await login(values.email, values.password)

    if (!result.success) {
      setFormError(result.error)
      toast.add({
        type: "error",
        title: "Could not sign in",
        description: result.error,
      })
    }
  }

  const emailError = errors.email?.message
  const passwordError = errors.password?.message

  return (
    <form
      className="w-full space-y-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
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
          disabled={!isValid || isSubmitting}
          className="h-11 w-44 text-xs font-semibold tracking-wider"
        >
          Sign in
        </Button>
      </div>

      <FormError message={formError} />

      <div className="pt-4 text-center">
        <AuthLink href="/forgot-password">Forgot password</AuthLink>
      </div>
    </form>
  )
}
