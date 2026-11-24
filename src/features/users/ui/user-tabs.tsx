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

export function UserTabs({
  userId,
  showCvs = false,
}: {
  userId: string;
  showCvs?: boolean;
}) {
  const active = useSelectedLayoutSegment();
  const tabs = showCvs
    ? TABS
    : TABS.filter((tab) => tab.segment !== "cvs");

  return (
    <nav aria-label="User sections" className="flex border-b">
      {tabs.map(({ segment, label }) => {
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
