"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { createCvAction, updateCvAction } from "../../api/cvs.actions";
import type { UsersActionResult } from "../../model/action-result";
import type { CvRecord } from "../../model/cv-record";
import { CV_TEXT_MAX, cvSchema, type CvValues } from "../../model/cv-schema";
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
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "@/shared/ui/toast";

const EMPTY_VALUES: CvValues = {
  name: "",
  education: "",
  description: "",
};

type CvDialogProps = {
  mode: "create" | "update";
  userId: string;
  cv?: CvRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function toFormValues(cv: CvRecord): CvValues {
  return {
    name: cv.name,
    education: cv.education ?? "",
    description: cv.description,
  };
}

function CvForm({
  mode,
  userId,
  cv,
  onDone,
  onCancel,
}: {
  mode: "create" | "update";
  userId: string;
  cv?: CvRecord | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const isCreate = mode === "create";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CvValues>({
    resolver: zodResolver(cvSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: cv ? toFormValues(cv) : EMPTY_VALUES,
  });

  const name = useWatch({ control, name: "name" });
  const education = useWatch({ control, name: "education" });
  const description = useWatch({ control, name: "description" });
  const isComplete =
    name.trim().length > 0 &&
    name.trim().length <= CV_TEXT_MAX &&
    education.trim().length > 0 &&
    education.trim().length <= CV_TEXT_MAX &&
    description.trim().length > 0;

  async function onSubmit(values: CvValues) {
    setFormError(null);

    let result: UsersActionResult;

    if (isCreate) {
      result = await createCvAction(userId, values);
    } else if (cv) {
      result = await updateCvAction(userId, cv.id, values);
    } else {
      return;
    }

    if (!result.success) {
      setFormError(result.error);
      toast.add({
        type: "error",
        title: isCreate ? "Could not create the CV" : "Could not update the CV",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: isCreate ? "CV created" : "CV updated",
      description: `${values.name} has been ${isCreate ? "created" : "updated"}.`,
    });
    router.refresh();
    onDone();
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="cv-name"
          className="mb-1 block text-xs text-muted-foreground"
        >
          Name
        </label>
        <Input
          id="cv-name"
          placeholder="Name"
          maxLength={CV_TEXT_MAX}
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

      <div>
        <label
          htmlFor="cv-education"
          className="mb-1 block text-xs text-muted-foreground"
        >
          Education
        </label>
        <Input
          id="cv-education"
          placeholder="Education"
          maxLength={CV_TEXT_MAX}
          variant={errors.education ? "error" : "default"}
          aria-invalid={errors.education ? true : undefined}
          {...register("education")}
        />
        {errors.education && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {errors.education.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="cv-description"
          className="mb-1 block text-xs text-muted-foreground"
        >
          Description
        </label>
        <Textarea
          id="cv-description"
          placeholder="Description"
          variant={errors.description ? "error" : "default"}
          aria-invalid={errors.description ? true : undefined}
          {...register("description")}
        />
        {errors.description && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-xs text-destructive">
          {formError}
        </p>
      )}

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
          disabled={isSubmitting || (isCreate && !isComplete)}
        >
          {isCreate ? "Create" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CvDialog({
  mode,
  userId,
  cv,
  open,
  onOpenChange,
}: CvDialogProps) {
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isCreate ? "Create CV" : "Update CV"}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Create a CV for the selected employee."
              : "Update the CV details."}
          </DialogDescription>
        </DialogHeader>

        {isCreate || cv ? (
          <CvForm
            mode={mode}
            userId={userId}
            cv={cv}
            onCancel={() => onOpenChange(false)}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
