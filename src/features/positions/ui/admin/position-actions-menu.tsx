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

import type { PositionRecord } from "../../model/position-record";
import { DeletePositionDialog } from "./delete-position-dialog";
import { PositionDialog } from "./position-dialog";

type PositionActionsMenuProps = {
  position: PositionRecord;
};

export function PositionActionsMenu({ position }: PositionActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="icon"
              aria-label={`Actions for position ${position.name}`}
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

      <PositionDialog
        mode="update"
        position={position}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeletePositionDialog
        position={position}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
