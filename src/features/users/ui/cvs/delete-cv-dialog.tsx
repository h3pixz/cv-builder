"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCvAction } from "../../api/cvs.actions";
import type { CvRecord } from "../../model/cv-record";
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

type DeleteCvDialogProps = {
  userId: string;
  cv: CvRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCvDialog({
  userId,
  cv,
  open,
  onOpenChange,
}: DeleteCvDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onConfirm() {
    if (!cv) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await deleteCvAction(userId, cv.id);

      if (!result.success) {
        setFormError(result.error);
        toast.add({
          type: "error",
          title: "Could not delete the CV",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "CV deleted",
        description: `${cv.name} has been deleted.`,
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
          <DialogTitle>Delete CV</DialogTitle>
          <DialogDescription>
            {cv
              ? `Are you sure you want to delete CV ${cv.name}?`
              : "Are you sure you want to delete this CV?"}
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
            disabled={isSubmitting || !cv}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
