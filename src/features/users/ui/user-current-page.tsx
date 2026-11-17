"use client";
import { usePathname } from "next/navigation";

export function UserCurrentPage() {
  const pathname = usePathname().split("/").pop();
  return <div className="first-letter:uppercase">{pathname}</div>;
}
