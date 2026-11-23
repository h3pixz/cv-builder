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

import { deleteDepartmentAction } from "../../api/catalog.actions";
import type { DepartmentRecord } from "../../model/department-record";

type DeleteDepartmentDialogProps = {
  department: DepartmentRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteDepartmentDialog({
  department,
  open,
  onOpenChange,
}: DeleteDepartmentDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onConfirm() {
    if (!department) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await deleteDepartmentAction(department.id);

      if (!result.success) {
        setFormError(result.error);
        toast.add({
          type: "error",
          title: "Could not delete the department",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Department deleted",
        description: `${department.name} has been deleted.`,
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
          <DialogTitle>Delete department</DialogTitle>
          <DialogDescription>
            {department
              ? `Are you sure you want to delete department ${department.name}?`
              : "Are you sure you want to delete this department?"}
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
            disabled={isSubmitting || !department}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
