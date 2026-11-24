"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { toast } from "@/shared/ui/toast";

import { changePasswordAction } from "../api/password.actions";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "../model/password-schema";

const EMPTY_VALUES: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: EMPTY_VALUES,
  });

  async function onSubmit(values: ChangePasswordValues) {
    setFormError(null);

    const result = await changePasswordAction(values);

    if (!result.success) {
      setFormError(result.error);
      toast.add({
        type: "error",
        title: "Could not change the password",
        description: result.error,
      });
      return;
    }

    reset(EMPTY_VALUES);
    toast.add({
      type: "success",
      title: "Password changed",
      description: "Your password has been updated.",
    });
  }

  return (
    <form
      className="flex flex-col"
      noValidate
      aria-busy={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-8">
        <div>
          <Label htmlFor="settings-current-password" className="sr-only">
            Password
          </Label>
          <PasswordInput
            id="settings-current-password"
            autoComplete="current-password"
            placeholder="Password"
            variant={errors.currentPassword ? "error" : "default"}
            aria-invalid={errors.currentPassword ? true : undefined}
            aria-describedby={
              errors.currentPassword ? "settings-current-password-error" : undefined
            }
            className="h-11 pl-4 text-sm"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p
              id="settings-current-password-error"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="settings-new-password" className="sr-only">
            New Password
          </Label>
          <PasswordInput
            id="settings-new-password"
            autoComplete="new-password"
            placeholder="New Password"
            variant={errors.newPassword ? "error" : "default"}
            aria-invalid={errors.newPassword ? true : undefined}
            aria-describedby={
              errors.newPassword ? "settings-new-password-error" : undefined
            }
            className="h-11 pl-4 text-sm"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p
              id="settings-new-password-error"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="settings-confirm-password" className="sr-only">
            Confirm Password
          </Label>
          <PasswordInput
            id="settings-confirm-password"
            autoComplete="new-password"
            placeholder="Confirm Password"
            variant={errors.confirmPassword ? "error" : "default"}
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={
              errors.confirmPassword
                ? "settings-confirm-password-error"
                : undefined
            }
            className="h-11 pl-4 text-sm"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p
              id="settings-confirm-password-error"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {formError && (
        <p role="alert" className="mt-4 text-xs text-destructive">
          {formError}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting && (
            <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
          )}
          {isSubmitting ? "Changing..." : "Change"}
        </Button>
      </div>
    </form>
  );
}
