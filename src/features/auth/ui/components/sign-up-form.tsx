"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/ui/button"
import { Input, PasswordInput } from "@/shared/ui/input"
import { toast } from "@/shared/ui/toast"
import { signUpSchema, type SignUpValues } from "../../model/sign-up-schema"
import { signup } from "../../api/signup"
import { AuthLink } from "./auth-link"
import { FormError } from "./form-error"

export function SignUpForm() {
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: SignUpValues) {
    setFormError(null)

    const result = await signup(
      values.email,
      values.password,
      values.confirmPassword,
    )

    if (!result.success) {
      if (result.code === "userAlreadyExists") {
        setError("email", { type: "server", message: result.error })
        return
      }

      setFormError(result.error)
      toast.add({
        type: "error",
        title: "Could not create the account",
        description: result.error,
      })
    }
  }

  const emailError = errors.email?.message
  const passwordError = errors.password?.message
  const confirmPasswordError = errors.confirmPassword?.message

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
          autoComplete="new-password"
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

      <div className="w-full">
        <label htmlFor="confirmPassword" className="sr-only">
          Confirm password
        </label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm password"
          variant={confirmPasswordError ? "error" : "default"}
          aria-invalid={confirmPasswordError ? true : undefined}
          aria-describedby={
            confirmPasswordError ? "confirm-password-error" : undefined
          }
          className="h-11 pl-4 text-sm"
          {...register("confirmPassword")}
        />
        {confirmPasswordError && (
          <p
            id="confirm-password-error"
            role="alert"
            className="mt-1 text-xs text-error"
          >
            {confirmPasswordError}
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
          Create account
        </Button>
      </div>

      <FormError message={formError} />

      <div className="pt-2 text-center">
        <AuthLink href="/sign-in">I have an account</AuthLink>
      </div>
    </form>
  )
}
