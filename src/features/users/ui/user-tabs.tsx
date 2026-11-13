"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { segment: "profile", label: "Profile" },
  { segment: "skills", label: "Skills" },
  { segment: "languages", label: "Languages" },
  { segment: "cvs", label: "CVs" },
] as const;

export function UserTabs({ userId }: { userId: string }) {
  const active = useSelectedLayoutSegment();

  return (
    <nav aria-label="User sections" className="flex border-b">
      {TABS.map(({ segment, label }) => {
        const isActive = active === segment;
        return (
          <Link
            key={segment}
            href={`/users/${userId}/${segment}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.02em] transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
