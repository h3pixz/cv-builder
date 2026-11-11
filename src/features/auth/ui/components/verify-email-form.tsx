"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { CodeInput } from "@/shared/ui/input"

export function VerifyEmailForm() {
  const [code, setCode] = useState("")

  return (
    <form
      className="flex w-full flex-col items-center"
      onSubmit={(event) => event.preventDefault()}
    >
      <CodeInput
        value={code}
        onChange={setCode}
        length={6}
        submitOnComplete={false}
        className="mb-8"
      />

      <Button
        type="submit"
        variant="primary"
        className="h-11 w-44 text-xs font-semibold tracking-wider"
      >
        Confirm
      </Button>

      <div className="mt-6 text-center">
        <Link
          href="/sign-in"
          className="text-xs font-semibold tracking-wider text-text-secondary uppercase transition-colors hover:text-foreground"
        >
          Later
        </Link>
      </div>
    </form>
  )
}
