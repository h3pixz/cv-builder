"use client";

import { useState } from "react";
import { MoreVerticalIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import type { LanguageRecord } from "../../model/language-record";
import { DeleteLanguageDialog } from "./delete-language-dialog";
import { LanguageDialog } from "./language-dialog";

type LanguageActionsMenuProps = {
  language: LanguageRecord;
};

export function LanguageActionsMenu({ language }: LanguageActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="icon"
              aria-label={`Actions for language ${language.name}`}
              className="size-8"
            />
          }
        >
          <MoreVerticalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto min-w-32">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LanguageDialog
        mode="update"
        language={language}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteLanguageDialog
        language={language}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
