"use client";

import { NoInternetPage } from "@/features/errors";

export default function ErrorPage({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return <NoInternetPage onRetry={retry} />;
}
