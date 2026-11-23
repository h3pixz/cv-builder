"use client";

import { Button } from "@/shared/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminLanguagesError({ error, reset }: Props) {
  return (
    <section className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-base font-semibold text-foreground">
        Failed to load the languages catalog
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "Something went wrong. Please try again."}
      </p>
      <Button type="button" variant="primary" onClick={reset}>
        Retry
      </Button>
    </section>
  );
}
