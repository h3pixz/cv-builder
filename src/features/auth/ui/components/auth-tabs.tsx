import Link from "next/link"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/sign-in", label: "Sign in", key: "sign-in" },
  { href: "/sign-up", label: "Sign up", key: "sign-up" },
] as const

export function AuthTabs({ active }: { active: "sign-in" | "sign-up" }) {
  return (
    <header className="flex w-full justify-center pt-6">
      <nav aria-label="Authentication tabs" className="flex items-center gap-12">
        {tabs.map((tab) => {
          const isActive = tab.key === active

          return (
            <div key={tab.key} className="relative flex flex-col items-center">
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "pb-3.5 text-xs font-semibold tracking-wider uppercase transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isActive
                    ? "text-primary hover:opacity-80"
                    : "text-foreground hover:text-foreground/80",
                )}
              >
                {tab.label}
              </Link>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-28 bg-primary" />
              )}
            </div>
          )
        })}
      </nav>
    </header>
  )
}
