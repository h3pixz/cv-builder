"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/button";

export function AdminSkillsHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="icon"
        aria-label="Go back"
        className="size-8"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
      </Button>
      <h1 className="text-lg font-semibold text-foreground">Skills</h1>
    </div>
  );
}
