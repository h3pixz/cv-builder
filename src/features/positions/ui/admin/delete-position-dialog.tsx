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

import { deletePositionAction } from "../../api/catalog.actions";
import type { PositionRecord } from "../../model/position-record";

type DeletePositionDialogProps = {
  position: PositionRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeletePositionDialog({
  position,
  open,
  onOpenChange,
}: DeletePositionDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onConfirm() {
    if (!position) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await deletePositionAction(position.id);

      if (!result.success) {
        setFormError(result.error);
        toast.add({
          type: "error",
          title: "Could not delete the position",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Position deleted",
        description: `${position.name} has been deleted.`,
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
          <DialogTitle>Delete position</DialogTitle>
          <DialogDescription>
            {position
              ? `Are you sure you want to delete position ${position.name}?`
              : "Are you sure you want to delete this position?"}
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
            disabled={isSubmitting || !position}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
