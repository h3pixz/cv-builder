"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { SelectOption } from "@/shared/ui/select";
import { CreateUserDialog } from "./create-user-dialog";

type UsersToolbarProps = {
  initialSearch: string;
  canManage: boolean;
  departments: SelectOption[];
  positions: SelectOption[];
};

export function UsersToolbar({
  initialSearch,
  canManage,
  departments,
  positions,
}: UsersToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(initialSearch);
  const [createOpen, setCreateOpen] = useState(false);
  const previousUrlSearch = useRef(urlSearch);

  // Follow external URL changes (Back/Forward) without clobbering what the user
  // is currently typing.
  useEffect(() => {
    if (urlSearch === previousUrlSearch.current) return;

    const previous = previousUrlSearch.current;
    previousUrlSearch.current = urlSearch;

    setValue((current) => (current === previous ? urlSearch : current));
  }, [urlSearch]);

  useEffect(() => {
    const trimmed = value.trim();

    // The input already matches the URL: this is a mount, a page/sort change or
    // any other navigation — pushing a URL update here would reset the page.
    if (trimmed === urlSearch) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }

      // A new filter always starts from the first page.
      params.delete("page");

      const next = params.toString();

      router.replace(next ? `${pathname}?${next}` : pathname);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, urlSearch, pathname, router, searchParams]);

  const canCreate = canManage && departments.length > 0 && positions.length > 0;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-57.5">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search"
            aria-label="Search users"
            className="h-9 rounded-full border-control-border bg-background pl-9 text-xs shadow-none placeholder:text-muted-foreground focus-visible:ring-ring/30"
          />
        </div>

        {canManage && (
          <Button
            variant="default"
            onClick={() => setCreateOpen(true)}
            disabled={!canCreate}
            className="h-9 min-w-0 shrink-0 gap-2 rounded-none px-2 text-xs"
          >
            <Plus className="size-4" />
            Create user
          </Button>
        )}
      </div>

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        departments={departments}
        positions={positions}
      />
    </>
  );
}
