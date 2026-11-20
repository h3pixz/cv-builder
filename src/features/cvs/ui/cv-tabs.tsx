"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@/lib/utils";

import { CV_TABS } from "../model/cv-tabs";

export function CvTabs({ cvId }: { cvId: string }) {
  const active = useSelectedLayoutSegment();

  return (
    <nav aria-label="CV sections" className="flex border-b">
      {CV_TABS.map(({ segment, label }) => {
        const isActive = active === segment;

        return (
          <Link
            key={segment}
            href={`/cvs/${cvId}/${segment}`}
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
