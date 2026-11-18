import { cn } from "@/lib/utils";

export function SadMonitorIllustration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "h-[120px] w-[160px] shrink-0 text-foreground",
        className,
      )}
      fill="none"
      viewBox="0 0 160 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="2"
        width="156"
        height="76"
        rx="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="56" cy="30" r="3.2" fill="currentColor" />
      <circle cx="104" cy="30" r="3.2" fill="currentColor" />
      <path
        d="M 54 52 Q 80 38 106 52"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <line
        x1="68"
        y1="78"
        x2="54"
        y2="114"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <line
        x1="92"
        y1="78"
        x2="106"
        y2="114"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <line
        x1="38"
        y1="114"
        x2="122"
        y2="114"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}
