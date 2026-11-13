"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/ui/button"
import { PasswordInput } from "@/shared/ui/input"
import { toast } from "@/shared/ui/toast"
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "../../model/reset-password-schema"
import { resetPassword } from "../../api/reset-password"
import { AuthLink } from "./auth-link"
import { FormError } from "./form-error"

const MISSING_TOKEN_MESSAGE =
  "This password reset link is expired or invalid"

export function ResetPasswordForm({ token }: { token?: string }) {
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      return
    }

    setFormError(null)

    const result = await resetPassword({ token, ...values })

    if (!result.success) {
      setFormError(result.error)
      toast.add({
        type: "error",
        title: "Could not reset the password",
        description: result.error,
      })
    }
  }

  const newPasswordError = errors.newPassword?.message
  const confirmPasswordError = errors.confirmPassword?.message

  return (
    <form className="w-full" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormError message={token ? formError : MISSING_TOKEN_MESSAGE} />

      <div className="w-full">
        <label htmlFor="newPassword" className="sr-only">
          New password
        </label>
        <PasswordInput
          id="newPassword"
          autoComplete="new-password"
          placeholder="New password"
          variant={newPasswordError ? "error" : "default"}
          aria-invalid={newPasswordError ? true : undefined}
          aria-describedby={
            newPasswordError ? "new-password-error" : undefined
          }
          className="h-11 pl-4 text-sm"
          {...register("newPassword")}
        />
        {newPasswordError && (
          <p
            id="new-password-error"
            role="alert"
            className="mt-1 text-xs text-error"
          >
            {newPasswordError}
          </p>
        )}
      </div>

      <div className="mt-9 w-full">
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

      <div className="mt-9 flex justify-center">
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isSubmitting || !token}
          className="h-12 w-30 text-xs font-semibold tracking-wider"
        >
          Submit
        </Button>
      </div>

      <div className="mt-6 text-center">
        <AuthLink href="/sign-in">Go to sign in</AuthLink>
      </div>
    </form>
  )
}
