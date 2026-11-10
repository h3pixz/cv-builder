import * as React from "react";

import { cn } from "@/lib/utils";

export type LevelValue = 0 | 1 | 2 | 3 | 4 | 5;

export const MAX_LEVEL = 5;

const LEVEL_STYLES: Record<LevelValue, { fill: string; track: string }> = {
  0: { fill: "bg-level-0-fill", track: "bg-level-0-track" },
  1: { fill: "bg-level-1-fill", track: "bg-level-1-track" },
  2: { fill: "bg-level-2-fill", track: "bg-level-2-track" },
  3: { fill: "bg-level-3-fill", track: "bg-level-3-track" },
  4: { fill: "bg-level-4-fill", track: "bg-level-4-track" },
  5: { fill: "bg-level-5-fill", track: "bg-level-5-track" },
};

function clampLevel(value: number): LevelValue {
  return Math.min(MAX_LEVEL, Math.max(0, Math.round(value))) as LevelValue;
}

interface LevelProps extends React.HTMLAttributes<HTMLDivElement> {
  level: number;
  label?: string;
  barClassName?: string;
}

export function Level({
  level,
  label,
  barClassName,
  className,
  ...props
}: LevelProps) {
  const value = clampLevel(level);
  const styles = LEVEL_STYLES[value];
  const percent = (value / MAX_LEVEL) * 100;

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={MAX_LEVEL}
      aria-valuenow={value}
      aria-label={typeof label === "string" ? label : `Level ${value}`}
      className={cn("flex w-fit items-center justify-between gap-6", className)}
      {...props}
    >
      <div
        className={cn(
          "relative h-1 w-34 shrink-0 overflow-hidden rounded-full",
          styles.track,
          barClassName,
        )}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-[width] duration-300",
            styles.fill,
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {label ? (
        <span className="label-xl label-label-secondary">{label}</span>
      ) : null}
    </div>
  );
}
