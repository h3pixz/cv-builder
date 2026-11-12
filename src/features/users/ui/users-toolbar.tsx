"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type UsersToolbarProps = {
  initialSearch: string;
};

export function UsersToolbar({ initialSearch }: UsersToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialSearch);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = value.trim();

      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }

      const next = params.toString();

      if (next === searchParams.toString()) return;

      router.replace(next ? `${pathname}?${next}` : pathname);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, pathname, router, searchParams]);

  return (
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

      <Button
        variant="default"
        // Adjust the route to your app
        onClick={() => router.push("/users/new")}
        className="h-9 min-w-0 shrink-0 gap-2 rounded-none px-2 text-xs"
      >
        <Plus className="size-4" />
        Create user
      </Button>
    </div>
  );
}
