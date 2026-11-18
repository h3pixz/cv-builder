"use client";

import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  profile: "Profile",
  skills: "Skills",
  languages: "Languages",
  cvs: "CVs",
};

export function UserCurrentPage() {
  const segments = usePathname().split("/").filter(Boolean);
  const current = segments.at(-1) ?? "";
  const parent = segments.at(-2);
  const label =
    LABELS[current] ?? (parent === "cvs" ? "CV Details" : current);

  return <div className="first-letter:uppercase">{label}</div>;
}
