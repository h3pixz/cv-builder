"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { CvDialog } from "./cv-dialog";

export function CvsToolbar({
  ownerUserId,
  initialSearch,
}: {
  ownerUserId: string;
  initialSearch: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(initialSearch);
  const [createOpen, setCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const previousUrlSearch = useRef(urlSearch);

  useEffect(() => {
    if (urlSearch === previousUrlSearch.current) return;

    const previous = previousUrlSearch.current;
    previousUrlSearch.current = urlSearch;

    setValue((current) => (current === previous ? urlSearch : current));
  }, [urlSearch]);

  useEffect(() => {
    const trimmed = value.trim();

    if (trimmed === urlSearch) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");

      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }

      const next = params.toString();

      startTransition(() =>
        router.replace(next ? `${pathname}?${next}` : pathname),
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, urlSearch, pathname, router, searchParams]);

  return (
    <>
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

        <Button
          variant="default"
          onClick={() => setCreateOpen(true)}
          className="shrink-0"
        >
          <PlusIcon className="size-4" />
          Create CV
        </Button>
      </div>

      <CvDialog
        mode="create"
        ownerUserId={ownerUserId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  );
}
