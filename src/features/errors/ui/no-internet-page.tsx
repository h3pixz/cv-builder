"use client";

import { Button } from "@/shared/ui/button";
import { SadMonitorIllustration } from "./sad-monitor-illustration";

type NoInternetPageProps = {
  onRetry: () => void;
  autoFocusRetry?: boolean;
};

export function NoInternetPage({
  onRetry,
  autoFocusRetry = false,
}: NoInternetPageProps) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-background px-6 py-10 text-center">
      <SadMonitorIllustration className="mb-7" />

      <h1 className="mb-4 text-4xl font-normal tracking-tight text-foreground">
        Oops
      </h1>

      <p className="mb-8 max-w-sm text-base leading-relaxed text-text-secondary sm:max-w-md">
        Something went wrong. We’re already working on fixing it. Please try
        again.
      </p>

      <Button
        variant="primary"
        className="h-12 w-[220px] text-center text-sm leading-[24.5px] font-medium tracking-[0.4px]"
        onClick={onRetry}
        autoFocus={autoFocusRetry}
      >
        RETRY
      </Button>
    </main>
  );
}
