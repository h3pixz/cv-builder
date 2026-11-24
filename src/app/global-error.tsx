"use client";

import "./globals.css";
import { NoInternetPage } from "@/features/errors";
import { THEME_SCRIPT } from "@/shared/config/theme-script";
import { reloadPage } from "@/shared/helpers/reload-page";

export default function GlobalError() {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <NoInternetPage onRetry={reloadPage} />
      </body>
    </html>
  );
}
