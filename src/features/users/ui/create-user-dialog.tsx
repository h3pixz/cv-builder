"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { type ActionResult } from "@/shared/api";
import { USER_ROLES, type UserRoleValue } from "@/shared/types/user-role";

import { createUserAction } from "../api/users.actions";
import { createUserSchema, type CreateUserValues } from "../model/user-schema";
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

const EMPTY_VALUES: CreateUserValues = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  departmentId: "",
  positionId: "",
  role: "" as UserRoleValue,
};

type CreateUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: SelectOption[];
  positions: SelectOption[];
};

function CreateUserForm({
  onCreated,
  onCancel,
  departments,
  positions,
}: {
  onCreated: () => void;
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
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: EMPTY_VALUES,
  });

  async function onSubmit(values: CreateUserValues) {
    setFormError(null);

    const result: ActionResult = await createUserAction(values);

    if (!result.success) {
      if (result.code === "userAlreadyExists") {
        setError("email", { type: "server", message: result.error });
        return;
      }

      setFormError(result.error);
      toast.add({
        type: "error",
        title: "Could not create the user",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: "User created",
      description: `${values.firstName} ${values.lastName} has been created.`,
    });
    router.refresh();
    onCreated();
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="create-user-email"
          className="mb-1 block text-xs text-muted-foreground"
        >
          Email
        </label>
        <Input
          id="create-user-email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          variant={errors.email ? "error" : "default"}
          aria-invalid={errors.email ? true : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="create-user-password"
          className="mb-1 block text-xs text-muted-foreground"
        >
          Password
        </label>
        <PasswordInput
          id="create-user-password"
          autoComplete="new-password"
          placeholder="Password"
          variant={errors.password ? "error" : "default"}
          aria-invalid={errors.password ? true : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="create-user-first-name"
            className="mb-1 block text-xs text-muted-foreground"
          >
            First Name
          </label>
          <Input
            id="create-user-first-name"
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
            htmlFor="create-user-last-name"
            className="mb-1 block text-xs text-muted-foreground"
          >
            Last Name
          </label>
          <Input
            id="create-user-last-name"
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
              id="create-user-department"
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
              id="create-user-position"
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
            id="create-user-role"
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
          Create
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CreateUserDialog({
  open,
  onOpenChange,
  departments,
  positions,
}: CreateUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Add a new employee to the organization.
          </DialogDescription>
        </DialogHeader>

        <CreateUserForm
          departments={departments}
          positions={positions}
          onCancel={() => onOpenChange(false)}
          onCreated={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
