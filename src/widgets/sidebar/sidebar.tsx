// widgets/sidebar/ui/sidebar.tsx
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  FileUser,
  Folder,
  Languages,
  TrendingUp,
  Users,
} from "lucide-react";

import { cn } from "cn";

const mainNavigation = [
  { label: "Employees", href: "/users", icon: Users },
  { label: "Skills", href: "/skills", icon: TrendingUp },
  { label: "Languages", href: "/languages", icon: Languages },
  { label: "CVs", href: "/cvs", icon: FileUser },
];

const managementNavigation = [
  { label: "Departments", href: "/departments", icon: Building2 },
  { label: "Positions", href: "/positions", icon: BriefcaseBusiness },
  { label: "Projects", href: "/projects", icon: Folder },
];

type NavItems = typeof mainNavigation;

/** Pure rendering: no hooks, so it can be used as the Suspense fallback too. */
function NavLinks({
  items,
  pathname,
  isCollapsed,
}: {
  items: NavItems;
  pathname: string | null; // null = not known yet (fallback)
  isCollapsed: boolean;
}) {
  return items.map(({ label, href, icon: Icon }) => {
    const isActive =
      pathname !== null &&
      (pathname === href || pathname.startsWith(`${href}/`));

    return (
      <Link
        key={href}
        href={href}
        title={isCollapsed ? label : undefined}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-12 items-center gap-4 rounded-r-full px-5",
          "text-sm font-medium text-sidebar-foreground",
          "transition-colors hover:bg-sidebar-accent/70",
          isActive && "bg-sidebar-accent",
          isCollapsed && "justify-center rounded-full px-0",
        )}
      >
        <Icon className="size-5 shrink-0" strokeWidth={2} />
        {!isCollapsed && <span>{label}</span>}
      </Link>
    );
  });
}

/** The only component that reads usePathname(). */
function ActiveNavLinks(props: { items: NavItems; isCollapsed: boolean }) {
  const pathname = usePathname();
  return <NavLinks {...props} pathname={pathname} />;
}

function NavGroup(props: { items: NavItems; isCollapsed: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <Suspense fallback={<NavLinks {...props} pathname={null} />}>
        <ActiveNavLinks {...props} />
      </Suspense>
    </div>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-dvh shrink-0 flex-col",
        "border-r border-sidebar-border bg-sidebar",
        "transition-[width] duration-200",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-20 shrink-0 items-center px-4",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {/* Logo mark */}
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-md bg-[#2E2E2E]">
            <span className="h-4 w-1.5 rounded-sm bg-white" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
          </div>

          {!isCollapsed && (
            <span className="truncate text-base font-semibold text-sidebar-foreground">
              CV Builder
            </span>
          )}
        </Link>

        {!isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            aria-label="Collapse sidebar"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            aria-label="Expand sidebar"
            className="absolute -right-3 top-7 rounded-full border border-sidebar-border bg-sidebar p-1 text-muted-foreground shadow-sm transition-colors hover:text-sidebar-foreground"
          >
            <ChevronLeft className="size-4 rotate-180" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <NavGroup items={mainNavigation} isCollapsed={isCollapsed} />
        <div className="mx-4 my-5 border-t border-sidebar-border" />
        <NavGroup items={managementNavigation} isCollapsed={isCollapsed} />
      </nav>
    </aside>
  );
}
