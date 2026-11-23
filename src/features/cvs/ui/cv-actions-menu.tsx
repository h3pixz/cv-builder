"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVerticalIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import type { CvRecord } from "../model/cv-record";
import { CvDialog } from "./cv-dialog";
import { DeleteCvDialog } from "./delete-cv-dialog";

export function CvActionsMenu({ cv }: { cv: CvRecord }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="icon"
              aria-label={`Actions for CV ${cv.name}`}
              className="size-8"
            />
          }
        >
          <MoreVerticalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto min-w-32">
          <DropdownMenuItem render={<Link href={`/cvs/${cv.id}`} />}>
            View
          </DropdownMenuItem>
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

      <CvDialog
        mode="update"
        ownerUserId={cv.ownerId ?? ""}
        cv={cv}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteCvDialog cv={cv} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}
