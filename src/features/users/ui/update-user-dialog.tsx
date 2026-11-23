"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { type ActionResult } from "@/shared/api";
import { USER_ROLES, type UserRoleValue } from "@/shared/types/user-role";

import { updateUserAction } from "../api/users.actions";
import type { UserRecord } from "../model/user-record";
import { updateUserSchema, type UpdateUserValues } from "../model/user-schema";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input, PasswordInput } from "@/shared/ui/input";
import { SelectField, type SelectOption } from "@/shared/ui/select";
import { toast } from "@/shared/ui/toast";

const ROLE_LABELS: Record<UserRoleValue, string> = {
  Admin: "Admin",
  Employee: "Employee",
};

const ROLE_OPTIONS: SelectOption[] = USER_ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

type UpdateUserDialogProps = {
  user: UserRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: SelectOption[];
  positions: SelectOption[];
};

function toFormValues(user: UserRecord): UpdateUserValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    departmentId: user.departmentId,
    positionId: user.positionId,
    role: user.role,
  };
}

function UpdateUserForm({
  user,
  onUpdated,
  onCancel,
  departments,
  positions,
}: {
  user: UserRecord;
  onUpdated: () => void;
  onCancel: () => void;
  departments: SelectOption[];
  positions: SelectOption[];
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: toFormValues(user),
  });

  async function onSubmit(values: UpdateUserValues) {
    setFormError(null);

    const result: ActionResult = await updateUserAction(user.id, values);

    if (!result.success) {
      setFormError(result.error);
      toast.add({
        type: "error",
        title: "Could not update the user",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: "User updated",
      description: `${values.firstName} ${values.lastName} has been updated.`,
    });
    router.refresh();
    onUpdated();
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="update-user-email"
          className="mb-1 block text-xs text-muted-foreground"
        >
          Email
        </label>
        <Input
          id="update-user-email"
          type="email"
          defaultValue={user.email}
          disabled
        />
      </div>

      <div>
        <label
          htmlFor="update-user-password"
          className="mb-1 block text-xs text-muted-foreground"
        >
          Password
        </label>
        <PasswordInput
          id="update-user-password"
          placeholder="Password cannot be changed"
          disabled
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="update-user-first-name"
            className="mb-1 block text-xs text-muted-foreground"
          >
            First Name
          </label>
          <Input
            id="update-user-first-name"
            placeholder="First Name"
            variant={errors.firstName ? "error" : "default"}
            aria-invalid={errors.firstName ? true : undefined}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="update-user-last-name"
            className="mb-1 block text-xs text-muted-foreground"
          >
            Last Name
          </label>
          <Input
            id="update-user-last-name"
            placeholder="Last Name"
            variant={errors.lastName ? "error" : "default"}
            aria-invalid={errors.lastName ? true : undefined}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="departmentId"
          render={({ field }) => (
            <SelectField
              id="update-user-department"
              name="departmentId"
              label="Department"
              placeholder="Department"
              options={departments}
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              error={errors.departmentId?.message}
              disabled={departments.length === 0}
            />
          )}
        />

        <Controller
          control={control}
          name="positionId"
          render={({ field }) => (
            <SelectField
              id="update-user-position"
              name="positionId"
              label="Position"
              placeholder="Position"
              options={positions}
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              error={errors.positionId?.message}
              disabled={positions.length === 0}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <SelectField
            id="update-user-role"
            name="role"
            label="Role"
            placeholder="Role"
            options={ROLE_OPTIONS}
            value={field.value || null}
            onValueChange={(value) => field.onChange(value ?? "")}
            error={errors.role?.message}
          />
        )}
      />

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
          disabled={!isValid || isSubmitting}
        >
          Save
        </Button>
      </DialogFooter>
    </form>
  );
}

export function UpdateUserDialog({
  user,
  open,
  onOpenChange,
  departments,
  positions,
}: UpdateUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update user</DialogTitle>
          <DialogDescription>
            Edit the employee details and access role.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <UpdateUserForm
            user={user}
            departments={departments}
            positions={positions}
            onCancel={() => onOpenChange(false)}
            onUpdated={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
