"use client";

import type { ReactNode } from "react";
import { reloadPage } from "@/shared/helpers/reload-page";
import { useOnlineStatus } from "@/shared/hooks/use-online-status";
import { NoInternetPage } from "./no-internet-page";

export function OfflineGuard({ children }: { children: ReactNode }) {
  const isOnline = useOnlineStatus();

  return (
    <>
      <div inert={!isOnline}>{children}</div>

      {!isOnline && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-label="No internet connection"
          className="fixed inset-0 z-40 overflow-y-auto bg-background"
        >
          <NoInternetPage autoFocusRetry onRetry={reloadPage} />
        </div>
      )}
    </>
  );
}
