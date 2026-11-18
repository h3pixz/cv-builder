"use client";

import type { ReactNode } from "react";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { DeviceErrorPage } from "./device-error-page";

const UNSUPPORTED_DEVICE_QUERY = "(max-width: 767px)";

export function DeviceGuard({ children }: { children: ReactNode }) {
  const isUnsupportedDevice = useMediaQuery(UNSUPPORTED_DEVICE_QUERY);

  return (
    <>
      <div inert={isUnsupportedDevice}>{children}</div>

      {isUnsupportedDevice && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-label="Unsupported device"
          className="fixed inset-0 z-40 overflow-y-auto bg-background"
        >
          <DeviceErrorPage />
        </div>
      )}
    </>
  );
}
