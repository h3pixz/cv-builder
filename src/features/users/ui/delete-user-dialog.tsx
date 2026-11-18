"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteUserAction } from "../api/users.actions";
import type { UserRecord } from "../model/user-record";
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

type DeleteUserDialogProps = {
  user: UserRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onConfirm() {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const result = await deleteUserAction(user.id);

      if (!result.success) {
        toast.add({
          type: "error",
          title: "Could not delete the user",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "User deleted",
        description: `${user.firstName} ${user.lastName} has been deleted.`,
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
          <DialogTitle>Delete user</DialogTitle>
          <DialogDescription>
            {user
              ? `Are you sure you want to delete user ${user.firstName} ${user.lastName}?`
              : "Are you sure you want to delete this user?"}
          </DialogDescription>
        </DialogHeader>

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
            disabled={isSubmitting || !user}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
