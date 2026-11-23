"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import type { ActionResult } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "@/shared/ui/toast";

import { createCvAction, updateCvAction } from "../api/cvs.actions";
import type { CvRecord } from "../model/cv-record";
import { CV_TEXT_MAX, cvSchema, type CvValues } from "../model/cv-schema";

const EMPTY_VALUES: CvValues = {
  name: "",
  education: "",
  description: "",
};

type CvDialogProps = {
  mode: "create" | "update";
  ownerUserId: string;
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
  ownerUserId,
  cv,
  onDone,
  onCancel,
}: {
  mode: "create" | "update";
  ownerUserId: string;
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

    let result: ActionResult;

    if (isCreate) {
      result = await createCvAction(ownerUserId, values);
    } else if (cv) {
      result = await updateCvAction(cv.ownerId ?? ownerUserId, cv.id, values);
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
        {!isCreate && (
          <label
            htmlFor="cv-name"
            className="mb-1 block text-xs text-muted-foreground"
          >
            Name
          </label>
        )}
        <Input
          id="cv-name"
          placeholder="Name"
          aria-label={isCreate ? "Name" : undefined}
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
        {!isCreate && (
          <label
            htmlFor="cv-education"
            className="mb-1 block text-xs text-muted-foreground"
          >
            Education
          </label>
        )}
        <Input
          id="cv-education"
          placeholder="Education"
          aria-label={isCreate ? "Education" : undefined}
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
        {!isCreate && (
          <label
            htmlFor="cv-description"
            className="mb-1 block text-xs text-muted-foreground"
          >
            Description
          </label>
        )}
        <Textarea
          id="cv-description"
          placeholder="Description"
          aria-label={isCreate ? "Description" : undefined}
          className="min-h-40"
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
          {isCreate ? "Create" : "Update"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CvDialog({
  mode,
  ownerUserId,
  cv,
  open,
  onOpenChange,
}: CvDialogProps) {
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Create CV" : "Update CV"}</DialogTitle>
        </DialogHeader>

        {isCreate || cv ? (
          <CvForm
            mode={mode}
            ownerUserId={ownerUserId}
            cv={cv}
            onCancel={() => onOpenChange(false)}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
