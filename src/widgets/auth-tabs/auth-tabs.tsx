import Link from "next/link"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/login", label: "Sign in", key: "login" },
  { href: "/signup", label: "Sign up", key: "signup" },
] as const

export function AuthTabs({ active }: { active: "login" | "signup" }) {
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
                  "pb-3.5 text-xs font-semibold tracking-wider uppercase transition-colors",
                  isActive
                    ? "text-primary"
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
