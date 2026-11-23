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
  createDepartmentAction,
  updateDepartmentAction,
} from "../../api/catalog.actions";
import {
  DEPARTMENT_NAME_MAX,
  catalogDepartmentSchema,
  type CatalogDepartmentValues,
} from "../../model/department-schema";
import type { DepartmentRecord } from "../../model/department-record";

type DepartmentDialogProps = {
  mode: "create" | "update";
  department?: DepartmentRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function DepartmentForm({
  mode,
  department,
  onCancel,
  onDone,
}: {
  mode: "create" | "update";
  department?: DepartmentRecord | null;
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
  } = useForm<CatalogDepartmentValues>({
    resolver: zodResolver(catalogDepartmentSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: department?.name ?? "",
    },
  });

  const name = useWatch({ control, name: "name" });
  const isComplete = name.trim().length > 0;

  async function onSubmit(values: CatalogDepartmentValues) {
    const result =
      isCreate || !department
        ? await createDepartmentAction(values)
        : await updateDepartmentAction(department.id, values);

    if (!result.success) {
      if (result.field === "name") {
        setError("name", { message: result.error });
      }

      toast.add({
        type: "error",
        title: isCreate
          ? "Could not create the department"
          : "Could not update the department",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: isCreate ? "Department created" : "Department updated",
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
        <Label htmlFor="department-name">Department</Label>
        <Input
          id="department-name"
          placeholder="Department"
          maxLength={DEPARTMENT_NAME_MAX}
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

export function DepartmentDialog({
  mode,
  department,
  open,
  onOpenChange,
}: DepartmentDialogProps) {
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create department" : "Edit department"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Add a new department to the catalog."
              : "Update the department name."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <DepartmentForm
            key={department?.id ?? "create"}
            mode={mode}
            department={department}
            onCancel={() => onOpenChange(false)}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
