"use client";

import { MoreVerticalIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function CvActionsMenu({ cvId }: { cvId: string }) {
  // TODO: link Details to the CV page, and wire Delete to a server action
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="icon" aria-label={`Actions for CV ${cvId}`} />}
      >
        <MoreVerticalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-32">
        <DropdownMenuItem disabled>Details</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" disabled>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
