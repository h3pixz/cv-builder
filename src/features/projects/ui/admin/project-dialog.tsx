"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

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
import { MultiselectField, type SelectOption } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "@/shared/ui/toast";
import { DatePicker } from "@/shared/ui/date-picker";

import {
  createProjectAction,
  updateProjectAction,
} from "../../api/catalog.actions";
import {
  PROJECT_DESCRIPTION_MAX,
  PROJECT_DOMAIN_MAX,
  PROJECT_NAME_MAX,
  projectSchema,
  type ProjectFormValues,
} from "../../model/project-schema";
import {
  formatDateInputValue,
  parseDateInputValue,
  toDateInputValue,
  type ProjectRecord,
} from "../../model/project-record";

type ProjectDialogProps = {
  mode: "create" | "update";
  project?: ProjectRecord | null;
  environmentOptions: SelectOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ProjectForm({
  mode,
  project,
  environmentOptions,
  onCancel,
  onDone,
}: {
  mode: "create" | "update";
  project?: ProjectRecord | null;
  environmentOptions: SelectOption[];
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
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: project?.name ?? "",
      domain: project?.domain ?? "",
      startDate: toDateInputValue(project?.startDate),
      endDate: toDateInputValue(project?.endDate),
      description: project?.description ?? "",
      environment: project?.environment ?? [],
    },
  });

  const startDateValue = useWatch({ control, name: "startDate" });
  const startDate = parseDateInputValue(startDateValue);

  async function onSubmit(values: ProjectFormValues) {
    const result =
      isCreate || !project
        ? await createProjectAction(values)
        : await updateProjectAction(project.id, values);

    if (!result.success) {
      if (result.field) {
        setError(result.field, { message: result.error });
      }

      toast.add({
        type: "error",
        title: isCreate
          ? "Could not create the project"
          : "Could not update the project",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: isCreate ? "Project created" : "Project updated",
      description: `${values.name} has been ${
        isCreate ? "created" : "updated"
      }.`,
    });
    router.refresh();
    onDone();
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="project-name">Name</Label>
          <Input
            id="project-name"
            placeholder="Project name"
            maxLength={PROJECT_NAME_MAX}
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

        <div className="space-y-1">
          <Label htmlFor="project-domain">Domain</Label>
          <Input
            id="project-domain"
            placeholder="Domain"
            maxLength={PROJECT_DOMAIN_MAX}
            variant={errors.domain ? "error" : "default"}
            aria-invalid={errors.domain ? true : undefined}
            {...register("domain")}
          />
          {errors.domain && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {errors.domain.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="project-start-date">Start date</Label>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                id="project-start-date"
                placeholder="Start date"
                value={parseDateInputValue(field.value)}
                onChange={(date) => field.onChange(formatDateInputValue(date))}
                onBlur={field.onBlur}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.startDate && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="project-end-date">End date</Label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                id="project-end-date"
                placeholder="End date"
                value={parseDateInputValue(field.value)}
                onChange={(date) => field.onChange(formatDateInputValue(date))}
                onBlur={field.onBlur}
                disabledDates={startDate ? { before: startDate } : undefined}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.endDate && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          placeholder="Project description"
          rows={4}
          maxLength={PROJECT_DESCRIPTION_MAX}
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

      <div className="space-y-1">
        <Controller
          control={control}
          name="environment"
          render={({ field }) => (
            <MultiselectField
              options={environmentOptions}
              value={field.value}
              onValueChange={field.onChange}
              label="Environment"
              placeholder="Environment"
              disabled={isSubmitting}
            />
          )}
        />
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
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isCreate ? "Create" : "Update"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ProjectDialog({
  mode,
  project,
  environmentOptions,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create project" : "Update project"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Add a new project to the catalog."
              : "Update the project details."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ProjectForm
            key={project?.id ?? "create"}
            mode={mode}
            project={project}
            environmentOptions={environmentOptions}
            onCancel={() => onOpenChange(false)}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
