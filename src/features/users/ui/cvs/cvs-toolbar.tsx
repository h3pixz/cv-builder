// features/users/ui/cvs/cvs-toolbar.tsx
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function CvsToolbar({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const id = setTimeout(() => {
      const query = value.trim();
      startTransition(() =>
        router.replace(
          query ? `${pathname}?search=${encodeURIComponent(query)}` : pathname,
        ),
      );
    }, 300);
    return () => clearTimeout(id);
  }, [value, pathname, router]);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative w-full max-w-xs">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          aria-label="Search CVs"
          aria-busy={isPending}
          className="h-10 rounded-full pl-9"
        />
      </div>

      {/* TODO: wire up */}
      <Button variant="default" disabled>
        <PlusIcon className="size-4" />
        Create CV
      </Button>
    </div>
  );
}
