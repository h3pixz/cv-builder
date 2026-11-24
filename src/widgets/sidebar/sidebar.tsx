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
  LogOut,
  Settings,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import { cn } from "cn";
import { logout } from "@/features/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

const mainNavigation = [
  { label: "Employees", href: "/users", icon: Users },
  { label: "Skills", href: "/skills", icon: TrendingUp },
  { label: "Languages", href: "/languages", icon: Languages },
  { label: "CVs", href: "/cvs", icon: FileUser },
];

const managementNavigation = [
  {
    label: "Departments",
    href: "/admin/departments",
    icon: Building2,
    adminOnly: true,
  },
  {
    label: "Positions",
    href: "/admin/positions",
    icon: BriefcaseBusiness,
    adminOnly: true,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: Folder,
    adminOnly: true,
  },
  { label: "Skills", href: "/admin/skills", icon: TrendingUp, adminOnly: true },
  {
    label: "Languages",
    href: "/admin/languages",
    icon: Languages,
    adminOnly: true,
  },
];

type NavItem = {
  label: string;
  href: string;
  icon: typeof Users;
  adminOnly?: boolean;
};

type NavItems = NavItem[];

export type SidebarUser = {
  id: string;
  fullName: string;
  avatar: string | null;
};

const menuItemClassName =
  "cursor-pointer gap-2 hover:bg-accent hover:text-accent-foreground";

function NavLinks({
  items,
  pathname,
  isCollapsed,
}: {
  items: NavItems;
  pathname: string | null;
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

function ProfileMenu({
  user,
  isCollapsed,
}: {
  user: SidebarUser;
  isCollapsed: boolean;
}) {
  const initial = (user.fullName.trim() || "?").charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${user.fullName}`}
        className={cn(
          "flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors",
          "text-sidebar-foreground hover:bg-sidebar-accent",
          "focus-visible:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/40",
          isCollapsed && "justify-center",
        )}
      >
        <Avatar className="size-9 shrink-0">
          {user.avatar && <AvatarImage src={user.avatar} alt="" />}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>

        {!isCollapsed && (
          <span className="min-w-0 truncate text-sm font-medium">
            {user.fullName}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-56"
      >
        <DropdownMenuItem
          className={menuItemClassName}
          render={<Link href={`/users/${user.id}/profile`} />}
        >
          <UserRound className="size-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          className={menuItemClassName}
          render={<Link href="/settings" />}
        >
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer gap-2 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            void logout();
          }}
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Sidebar({
  isAdmin = false,
  user = null,
}: {
  isAdmin?: boolean;
  user?: SidebarUser | null;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const managementItems = managementNavigation.filter(
    (item) => !item.adminOnly || isAdmin,
  );

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
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground">
            <span className="h-4 w-1.5 rounded-sm bg-background" />
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
        {managementItems.length !== 0 && (
          <div className="mx-4 my-5 border-t border-sidebar-border" />
        )}
        <NavGroup items={managementItems} isCollapsed={isCollapsed} />
      </nav>

      {user && (
        <div className="mt-auto border-t border-sidebar-border p-3">
          <ProfileMenu user={user} isCollapsed={isCollapsed} />
        </div>
      )}
    </aside>
  );
}
