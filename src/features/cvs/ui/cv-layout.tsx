import { Suspense } from "react";
import Link from "next/link";
import { XIcon } from "lucide-react";

import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

import { getCvContext } from "../api/cvs.queries";
import { CvBreadcrumbs } from "./cv-breadcrumbs";
import { CvTabs } from "./cv-tabs";

async function CvHeader({ cvId }: { cvId: string }) {
  const { cv } = await getCvContext(cvId);

  return (
    <div className="flex items-center justify-between gap-4">
      <CvBreadcrumbs cvId={cvId} name={cv.name} />
      <Link
        href="/cvs"
        aria-label="Back to CVs"
        className={cn(
          buttonVariants({ variant: "icon" }),
          "size-8 shrink-0 rounded-full border border-border",
        )}
      >
        <XIcon className="size-4" />
      </Link>
    </div>
  );
}

export function CvLayout({
  cvId,
  children,
}: {
  cvId: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <Suspense fallback={<div className="h-5" />}>
        <CvHeader cvId={cvId} />
      </Suspense>

      <CvTabs cvId={cvId} />

      <div className="pt-6">{children}</div>
    </section>
  );
}
