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

import { deleteSkillAction } from "../../api/catalog.actions";
import type { SkillRecord } from "../../model/skill-record";

type DeleteSkillDialogProps = {
  skill: SkillRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteSkillDialog({
  skill,
  open,
  onOpenChange,
}: DeleteSkillDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onConfirm() {
    if (!skill) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await deleteSkillAction(skill.id);

      if (!result.success) {
        setFormError(result.error);
        toast.add({
          type: "error",
          title: "Could not delete the skill",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Skill deleted",
        description: `${skill.name} has been deleted.`,
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
          <DialogTitle>Delete skill</DialogTitle>
          <DialogDescription>
            {skill
              ? `Are you sure you want to delete skill ${skill.name}?`
              : "Are you sure you want to delete this skill?"}
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
            disabled={isSubmitting || !skill}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
