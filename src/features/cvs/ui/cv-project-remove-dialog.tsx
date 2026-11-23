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

import { removeCvProjectAction } from "../api/cv-projects.actions";
import type { CvProjectRecord } from "../model/cv-project-record";

type Props = {
  cvId: string;
  project: CvProjectRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CvProjectRemoveDialog({
  cvId,
  project,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setFormError(null);
    }

    onOpenChange(next);
  }

  async function onConfirm() {
    if (!project) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await removeCvProjectAction(cvId, project.id);

      if (!result.success) {
        setFormError(result.error);
        toast.add({
          type: "error",
          title: "Could not remove the project",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Project removed",
        description: `${project.name} has been removed.`,
      });
      handleOpenChange(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Remove project</DialogTitle>
          <DialogDescription>
            {project ? (
              <>
                Are you sure you want to remove project{" "}
                <strong className="font-semibold text-foreground">
                  {project.name}
                </strong>
                ?
              </>
            ) : (
              "Are you sure you want to remove this project?"
            )}
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
            onClick={() => handleOpenChange(false)}
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
