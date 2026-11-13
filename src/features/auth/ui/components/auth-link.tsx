import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function AuthLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-xs font-semibold tracking-wider text-text-secondary uppercase transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      {children}
    </Link>
  )
}
