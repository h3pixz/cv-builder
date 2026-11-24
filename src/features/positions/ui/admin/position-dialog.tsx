"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { toast } from "@/shared/ui/toast";

import {
  createPositionAction,
  updatePositionAction,
} from "../../api/catalog.actions";
import {
  POSITION_NAME_MAX,
  catalogPositionSchema,
  type CatalogPositionValues,
} from "../../model/position-schema";
import type { PositionRecord } from "../../model/position-record";

type PositionDialogProps = {
  mode: "create" | "update";
  position?: PositionRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function PositionForm({
  mode,
  position,
  onCancel,
  onDone,
}: {
  mode: "create" | "update";
  position?: PositionRecord | null;
  onCancel: () => void;
  onDone: () => void;
}) {
  const router = useRouter();
  const isCreate = mode === "create";

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CatalogPositionValues>({
    resolver: zodResolver(catalogPositionSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: position?.name ?? "",
    },
  });

  const name = useWatch({ control, name: "name" });
  const isComplete = name.trim().length > 0;

  async function onSubmit(values: CatalogPositionValues) {
    const result =
      isCreate || !position
        ? await createPositionAction(values)
        : await updatePositionAction(position.id, values);

    if (!result.success) {
      if (result.field === "name") {
        setError("name", { message: result.error });
      }

      toast.add({
        type: "error",
        title: isCreate
          ? "Could not create the position"
          : "Could not update the position",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: isCreate ? "Position created" : "Position updated",
      description: `${values.name} has been ${
        isCreate ? "created" : "updated"
      }.`,
    });
    router.refresh();
    onDone();
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <Label htmlFor="position-name">Position</Label>
        <Input
          id="position-name"
          placeholder="Position"
          maxLength={POSITION_NAME_MAX}
          autoFocus
          variant={errors.name ? "error" : "default"}
          aria-invalid={errors.name ? true : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !isComplete}
        >
          {isCreate ? "Create" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function PositionDialog({
  mode,
  position,
  open,
  onOpenChange,
}: PositionDialogProps) {
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create position" : "Edit position"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Add a new position to the catalog."
              : "Update the position name."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <PositionForm
            key={position?.id ?? "create"}
            mode={mode}
            position={position}
            onCancel={() => onOpenChange(false)}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
