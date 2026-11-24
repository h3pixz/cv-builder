"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SelectField, type SelectOption } from "@/shared/ui/select";
import { toast } from "@/shared/ui/toast";
import { VERIFY_EMAIL_ROUTE } from "@/shared/config";

import {
  sendVerificationEmailAction,
  updateProfileAction,
} from "../../api/profile.actions";
import {
  PROFILE_NAME_MAX_LENGTH,
  profileSchema,
  type ProfileValues,
} from "../../model/profile-schema";

type Props = {
  userId: string;
  values: ProfileValues;
  departmentName: string;
  positionName: string;
  departments: SelectOption[];
  positions: SelectOption[];
  canEdit: boolean;
  canVerifyEmail: boolean;
  isVerified: boolean;
};

function ReadOnlyField({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[10px] text-muted-foreground">
        {label}
      </Label>
      <Input id={id} name={id} defaultValue={value} readOnly />
    </div>
  );
}

function ReadOnlyProfileFields({
  firstName,
  lastName,
  departmentName,
  positionName,
}: {
  firstName: string;
  lastName: string;
  departmentName: string;
  positionName: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ReadOnlyField
        id="profile-first-name"
        label="First Name"
        value={firstName}
      />
      <ReadOnlyField
        id="profile-last-name"
        label="Last Name"
        value={lastName}
      />
      <ReadOnlyField
        id="profile-department"
        label="Department"
        value={departmentName}
      />
      <ReadOnlyField
        id="profile-position"
        label="Position"
        value={positionName}
      />
    </div>
  );
}

export function UserProfileForm({
  userId,
  values,
  departmentName,
  positionName,
  departments,
  positions,
  canEdit,
  canVerifyEmail,
  isVerified,
}: Props) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: values,
  });

  if (!canEdit) {
    return (
      <div className="w-full">
        <ReadOnlyProfileFields
          firstName={values.firstName}
          lastName={values.lastName}
          departmentName={departmentName}
          positionName={positionName}
        />
      </div>
    );
  }

  async function onSubmit(nextValues: ProfileValues) {
    setFormError(null);

    const result = await updateProfileAction(userId, nextValues);

    if (!result.success) {
      setFormError(result.error);
      toast.add({
        type: "error",
        title: "Could not update the profile",
        description: result.error,
      });
      return;
    }

    reset(nextValues);
    toast.add({
      type: "success",
      title: "Profile updated",
      description: "The profile information has been updated.",
    });
    router.refresh();
  }

  async function onVerifyEmail() {
    setFormError(null);
    setIsSendingVerification(true);

    try {
      const result = await sendVerificationEmailAction();

      if (!result.success) {
        setFormError(result.error);
        toast.add({
          type: "error",
          title: "Failed to send verification email",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Verification email has been sent",
      });
      router.push(VERIFY_EMAIL_ROUTE);
    } finally {
      setIsSendingVerification(false);
    }
  }

  return (
    <form
      className="w-full space-y-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label
            htmlFor="profile-first-name"
            className="text-xs text-muted-foreground"
          >
            First Name
          </Label>
          <Input
            id="profile-first-name"
            maxLength={PROFILE_NAME_MAX_LENGTH}
            variant={errors.firstName ? "error" : "default"}
            aria-invalid={errors.firstName ? true : undefined}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p role="alert" className="text-xs text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="profile-last-name"
            className="text-xs text-muted-foreground"
          >
            Last Name
          </Label>
          <Input
            id="profile-last-name"
            maxLength={PROFILE_NAME_MAX_LENGTH}
            variant={errors.lastName ? "error" : "default"}
            aria-invalid={errors.lastName ? true : undefined}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p role="alert" className="text-xs text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <Controller
          control={control}
          name="departmentId"
          render={({ field }) => (
            <SelectField
              id="profile-department"
              name="departmentId"
              label="Department"
              placeholder="Department"
              options={departments}
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              error={errors.departmentId?.message}
              disabled={departments.length === 0}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="positionId"
          render={({ field }) => (
            <SelectField
              id="profile-position"
              name="positionId"
              label="Position"
              placeholder="Position"
              options={positions}
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              error={errors.positionId?.message}
              disabled={positions.length === 0}
              required
            />
          )}
        />
      </div>

      {formError && (
        <p role="alert" className="text-xs text-destructive">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-3">
        {canVerifyEmail && (
          <Button
            type="button"
            variant="secondary"
            onClick={onVerifyEmail}
            disabled={isVerified || isSendingVerification}
          >
            Verify email
          </Button>
        )}
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
