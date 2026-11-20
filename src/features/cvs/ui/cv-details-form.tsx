"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "@/shared/ui/toast";

import { updateCvAction } from "../api/cvs.actions";
import { CV_TEXT_MAX, cvSchema, type CvValues } from "../model/cv-schema";

type Props = {
  cvId: string;
  ownerUserId: string | null;
  values: CvValues;
};

export function CvDetailsForm({ cvId, ownerUserId, values }: Props) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<CvValues>({
    resolver: zodResolver(cvSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: values,
  });

  async function onSubmit(nextValues: CvValues) {
    setFormError(null);

    const result = await updateCvAction(ownerUserId, cvId, nextValues);

    if (!result.success) {
      setFormError(result.error);
      toast.add({
        type: "error",
        title: "Could not update the CV",
        description: result.error,
      });
      return;
    }

    reset(nextValues);
    toast.add({
      type: "success",
      title: "CV updated",
      description: `${nextValues.name} has been updated.`,
    });
    router.refresh();
  }

  return (
    <form
      className="max-w-5xl space-y-6"
      noValidate
      aria-busy={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-1">
        <Label
          htmlFor="cv-details-name"
          className="text-[10px] text-muted-foreground"
        >
          Name
        </Label>
        <Input
          id="cv-details-name"
          maxLength={CV_TEXT_MAX}
          variant={errors.name ? "error" : "default"}
          aria-invalid={errors.name ? true : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p role="alert" className="text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="cv-details-education"
          className="text-[10px] text-muted-foreground"
        >
          Education
        </Label>
        <Input
          id="cv-details-education"
          maxLength={CV_TEXT_MAX}
          variant={errors.education ? "error" : "default"}
          aria-invalid={errors.education ? true : undefined}
          {...register("education")}
        />
        {errors.education && (
          <p role="alert" className="text-xs text-destructive">
            {errors.education.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="cv-details-description"
          className="text-[10px] text-muted-foreground"
        >
          Description
        </Label>
        <Textarea
          id="cv-details-description"
          className="min-h-40"
          variant={errors.description ? "error" : "default"}
          aria-invalid={errors.description ? true : undefined}
          {...register("description")}
        />
        {errors.description && (
          <p role="alert" className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-xs text-destructive">
          {formError}
        </p>
      )}

      <div className="flex justify-end pt-3">
        <Button
          type="submit"
          variant="primary"
          disabled={!isDirty || !isValid || isSubmitting}
        >
          Update
        </Button>
      </div>
    </form>
  );
}
