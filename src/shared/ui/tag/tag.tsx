import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Outlined pill used for read-only values such as a project's environment.
 * Long values wrap instead of overflowing their container.
 */
export function Tag({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="tag"
      className={cn(
        "inline-flex max-w-full items-center rounded-full border border-control-border bg-transparent px-3 py-1 text-xs leading-5 break-words text-foreground",
        className,
      )}
      {...props}
    />
  );
}
