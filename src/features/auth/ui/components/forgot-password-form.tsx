"use client"

import { FormEvent, useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { toast } from "@/shared/ui/toast"
import { forgotPassword } from "../../api/forgot-password"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const result = await forgotPassword(email)

      if (result.success) {
        toast.add({
          type: "success",
          title: "Письмо отправлено",
          description: "Проверьте почту — в письме будет ссылка для сброса пароля",
        })
        setEmail("")
      } else {
        toast.add({
          type: "error",
          title: "Не удалось отправить письмо",
          description: result.error,
        })
      }
    })
  }

  return (
    <form
      className="flex w-full flex-col items-center"
      onSubmit={handleSubmit}
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 px-4 text-sm"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
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
