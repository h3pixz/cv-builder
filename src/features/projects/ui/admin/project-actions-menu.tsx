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
import type { SelectOption } from "@/shared/ui/select";

import type { ProjectRecord } from "../../model/project-record";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { ProjectDialog } from "./project-dialog";

type ProjectActionsMenuProps = {
  project: ProjectRecord;
  environmentOptions: SelectOption[];
};

export function ProjectActionsMenu({
  project,
  environmentOptions,
}: ProjectActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="icon"
              aria-label={`Actions for project ${project.name}`}
              className="size-8 p-0"
            >
              <MoreVerticalIcon className="size-4 text-accent" />
            </Button>
          }
        ></DropdownMenuTrigger>
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

      <ProjectDialog
        mode="update"
        project={project}
        environmentOptions={environmentOptions}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteProjectDialog
        project={project}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
