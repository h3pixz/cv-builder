"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import type { SkillCategoryOption } from "../../model/skill-record";
import { SkillDialog } from "./skill-dialog";

type AdminSkillsToolbarProps = {
  initialSearch: string;
  categories: SkillCategoryOption[];
};

export function AdminSkillsToolbar({
  initialSearch,
  categories,
}: AdminSkillsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(initialSearch);
  const [createOpen, setCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
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
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search"
            aria-label="Search skills"
            aria-busy={isPending}
            className="h-10 rounded-full pl-9"
          />
        </div>

        <Button
          variant="default"
          onClick={() => setCreateOpen(true)}
          disabled={categories.length === 0}
          className="shrink-0"
        >
          <PlusIcon className="size-4" />
          Create skill
        </Button>
      </div>

      <SkillDialog
        mode="create"
        categories={categories}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  );
}
