import { cn } from "@/lib/utils";

export function SadMonitorIllustration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "h-28 w-32 shrink-0 text-foreground sm:h-32 sm:w-36",
        className,
      )}
      fill="none"
      viewBox="0 0 160 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="16"
        y="8"
        width="128"
        height="88"
        rx="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="60" cy="40" r="3.2" fill="currentColor" />
      <circle cx="100" cy="40" r="3.2" fill="currentColor" />
      <path
        d="M 58 66 Q 80 50 102 66"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <line
        x1="70"
        y1="96"
        x2="58"
        y2="124"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <line
        x1="90"
        y1="96"
        x2="102"
        y2="124"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <line
        x1="46"
        y1="124"
        x2="114"
        y2="124"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}
