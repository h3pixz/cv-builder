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

      <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Oops
      </h1>

      <p className="mb-8 max-w-sm text-sm leading-relaxed text-text-secondary sm:max-w-md sm:text-base">
        Something went wrong. We’re already working on fixing it. Please try
        again.
      </p>

      <Button variant="primary" onClick={onRetry} autoFocus={autoFocusRetry}>
        RETRY
      </Button>
    </main>
  );
}
