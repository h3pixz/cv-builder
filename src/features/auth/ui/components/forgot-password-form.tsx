"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { toast } from "@/shared/ui/toast"
import { forgotPassword } from "../../api/forgot-password"
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "../../model/forgot-password-schema"

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    const result = await forgotPassword(values.email)

    if (result.success) {
      toast.add({
        type: "success",
        title: "Email sent",
        description: "Check your inbox for the password reset link",
      })
      reset()
    } else {
      toast.add({
        type: "error",
        title: "Could not send the email",
        description: result.error,
      })
    }
  }

  const emailError = errors.email?.message

  return (
    <form
      className="flex w-full flex-col items-center"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
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
          type="email"
          autoComplete="email"
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

      <Button
        type="submit"
        variant="primary"
        disabled={!isValid || isSubmitting}
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
