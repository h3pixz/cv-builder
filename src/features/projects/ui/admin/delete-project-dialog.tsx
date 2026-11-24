"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { toast } from "@/shared/ui/toast";

import { deleteProjectAction } from "../../api/catalog.actions";
import type { ProjectRecord } from "../../model/project-record";

type DeleteProjectDialogProps = {
  project: ProjectRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onConfirm() {
    if (!project) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await deleteProjectAction(project.id);

      if (!result.success) {
        setFormError(result.error);
        toast.add({
          type: "error",
          title: "Could not delete the project",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Project deleted",
        description: `${project.name} has been deleted.`,
      });
      onOpenChange(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            {project
              ? `Are you sure you want to delete project ${project.name}?`
              : "Are you sure you want to delete this project?"}
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <p role="alert" className="text-xs text-destructive">
            {formError}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            disabled={isSubmitting || !project}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
