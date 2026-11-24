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

import { deleteLanguageAction } from "../../api/catalog.actions";
import type { LanguageRecord } from "../../model/language-record";

type DeleteLanguageDialogProps = {
  language: LanguageRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteLanguageDialog({
  language,
  open,
  onOpenChange,
}: DeleteLanguageDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onConfirm() {
    if (!language) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await deleteLanguageAction(language.id);

      if (!result.success) {
        setFormError(result.error);
        toast.add({
          type: "error",
          title: "Could not delete the language",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Language deleted",
        description: `${language.name} has been deleted.`,
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
          <DialogTitle>Delete language</DialogTitle>
          <DialogDescription>
            {language
              ? `Are you sure you want to delete language ${language.name}?`
              : "Are you sure you want to delete this language?"}
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
            disabled={isSubmitting || !language}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
