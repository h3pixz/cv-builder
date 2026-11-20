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

import type {
  SkillCategoryOption,
  SkillRecord,
} from "../../model/skill-record";
import { DeleteSkillDialog } from "./delete-skill-dialog";
import { SkillDialog } from "./skill-dialog";

type SkillActionsMenuProps = {
  skill: SkillRecord;
  categories: SkillCategoryOption[];
};

export function SkillActionsMenu({
  skill,
  categories,
}: SkillActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="icon"
              aria-label={`Actions for skill ${skill.name}`}
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

      <SkillDialog
        mode="update"
        skill={skill}
        categories={categories}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteSkillDialog
        skill={skill}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
