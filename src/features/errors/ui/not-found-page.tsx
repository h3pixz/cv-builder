"use client";

import { Button } from "@/shared/ui/button";
import { SadMonitorIllustration } from "./sad-monitor-illustration";

type NotFoundPageProps = {
  onGoBack: () => void;
};

export function NotFoundPage({ onGoBack }: NotFoundPageProps) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-background px-6 py-10 text-center">
      <SadMonitorIllustration className="mb-6 sm:mb-7" />

      <h1 className="mb-4 text-4xl font-normal tracking-tight text-foreground">
        Hmm…
      </h1>

      <p className="mb-8 max-w-sm text-base leading-relaxed text-text-secondary sm:max-w-md">
        This doesn’t seem to be the page you were looking for.
        <br />
        Let’s get you back on track.
      </p>

      <Button
        variant="primary"
        className="h-12 w-[220px] text-center text-sm leading-[24.5px] font-medium tracking-[0.4px]"
        onClick={onGoBack}
      >
        GO BACK
      </Button>
    </main>
  );
}
