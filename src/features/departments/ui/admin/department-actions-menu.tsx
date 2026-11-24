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

import type { DepartmentRecord } from "../../model/department-record";
import { DeleteDepartmentDialog } from "./delete-department-dialog";
import { DepartmentDialog } from "./department-dialog";

type DepartmentActionsMenuProps = {
  department: DepartmentRecord;
};

export function DepartmentActionsMenu({
  department,
}: DepartmentActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="icon"
              aria-label={`Actions for department ${department.name}`}
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

      <DepartmentDialog
        mode="update"
        department={department}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteDepartmentDialog
        department={department}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
