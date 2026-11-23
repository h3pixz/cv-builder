"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { MultiselectField, SelectField } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "@/shared/ui/toast";

import {
  addCvProjectAction,
  updateCvProjectAction,
} from "../api/cv-projects.actions";
import type {
  CvProjectOption,
  CvProjectRecord,
} from "../model/cv-project-record";
import {
  createCvProjectSchema,
  type CvProjectValues,
  type ProjectBounds,
} from "../model/cv-project-schema";

type SharedProps = {
  cvId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: string[];
};

type AddProps = SharedProps & {
  mode: "add";
  options: CvProjectOption[];
};

type UpdateProps = SharedProps & {
  mode: "update";
  project: CvProjectRecord;
  bounds: ProjectBounds | null;
};

type Props = AddProps | UpdateProps;

function toValues(props: Props): CvProjectValues {
  if (props.mode === "update") {
    return {
      projectId: props.project.id,
      startDate: props.project.startDate,
      endDate: props.project.endDate ?? "",
      roles: props.project.roles,
      responsibilities: props.project.responsibilities.join("\n"),
    };
  }

  return {
    projectId: "",
    startDate: "",
    endDate: "",
    roles: [],
    responsibilities: "",
  };
}

export function CvProjectDialog(props: Props) {
  const { cvId, open, onOpenChange, roles } = props;
  const router = useRouter();

  const [formError, setFormError] = useState<string | null>(null);
  const boundsRef = useRef<ProjectBounds | null>(null);

  const resolver = useCallback<Resolver<CvProjectValues>>(
    (values, context, options) =>
      zodResolver(createCvProjectSchema(boundsRef.current))(
        values,
        context,
        options,
      ),
    [],
  );

  const form = useForm<CvProjectValues>({
    resolver,
    mode: "onChange",
    defaultValues: toValues(props),
  });

  const projectId = useWatch({ control: form.control, name: "projectId" });
  const startDate = useWatch({ control: form.control, name: "startDate" });
  const rolesValue = useWatch({ control: form.control, name: "roles" });

  const selectedProject =
    props.mode === "add"
      ? (props.options.find((option) => option.id === projectId) ?? null)
      : null;

  const details = props.mode === "update" ? props.project : selectedProject;

  const bounds = useMemo<ProjectBounds | null>(() => {
    if (props.mode === "update") {
      return props.bounds;
    }

    if (!selectedProject) {
      return null;
    }

    return {
      startDate: selectedProject.startDate,
      endDate: selectedProject.endDate,
    };
  }, [props, selectedProject]);

  useEffect(() => {
    boundsRef.current = bounds;
  }, [bounds]);

  const isAdd = props.mode === "add";
  const prefix = isAdd ? "cv-project-add" : "cv-project-update";

  const projectOptions =
    props.mode === "add"
      ? props.options.map((option) => ({
          value: option.id,
          label: option.name,
        }))
      : [{ value: props.project.id, label: props.project.name }];

  const roleOptions = roles.map((role) => ({ value: role, label: role }));

  const environmentOptions = (details?.environment ?? []).map((item) => ({
    value: item,
    label: item,
  }));

  const errors = form.formState.errors;
  const hasErrors = Object.keys(errors).length > 0;
  const requiredReady =
    Boolean(projectId) &&
    Boolean(startDate) &&
    (rolesValue?.length ?? 0) > 0;
  const canSubmit =
    (isAdd || form.formState.isDirty) &&
    requiredReady &&
    !hasErrors &&
    !form.formState.isSubmitting;

  function onProjectChange(value: string | null) {
    if (props.mode !== "add") {
      return;
    }

    const next =
      props.options.find((option) => option.id === value) ?? null;

    boundsRef.current = next
      ? { startDate: next.startDate, endDate: next.endDate }
      : null;

    form.setValue("startDate", next?.startDate ?? "", {
      shouldValidate: false,
    });
    form.setValue("endDate", next?.endDate ?? "", { shouldValidate: false });
    form.setValue("projectId", value ?? "", { shouldValidate: true });
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset(toValues(props));
      setFormError(null);
    }

    onOpenChange(next);
  }

  async function onSubmit(values: CvProjectValues) {
    setFormError(null);

    const result = isAdd
      ? await addCvProjectAction(cvId, values)
      : await updateCvProjectAction(cvId, values);

    if (!result.success) {
      setFormError(result.error);
      toast.add({
        type: "error",
        title: isAdd ? "Could not add the project" : "Could not update the project",
        description: result.error,
      });
      return;
    }

    const name =
      props.mode === "update" ? props.project.name : selectedProject?.name;

    toast.add({
      type: "success",
      title: isAdd ? "Project added" : "Project updated",
      description: `${name ?? "Project"} has been ${isAdd ? "added" : "updated"}.`,
    });
    handleOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isAdd ? "Add project" : "Update project"}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <SelectField
                    id={`${prefix}-project`}
                    name={field.name}
                    label="Name"
                    placeholder="Name"
                    options={projectOptions}
                    value={field.value || null}
                    onValueChange={onProjectChange}
                    error={errors.projectId?.message}
                    disabled={!isAdd}
                    required
                  />
                )}
              />

              <div className="space-y-1">
                <Label
                  htmlFor={`${prefix}-domain`}
                  className="text-xs text-muted-foreground"
                >
                  Domain
                </Label>
                <Input
                  id={`${prefix}-domain`}
                  placeholder="Domain"
                  value={details?.domain ?? ""}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label
                  htmlFor={`${prefix}-start-date`}
                  className="text-xs text-muted-foreground"
                >
                  Start Date
                </Label>
                <Input
                  id={`${prefix}-start-date`}
                  type="date"
                  min={bounds?.startDate}
                  max={bounds?.endDate ?? undefined}
                  variant={errors.startDate ? "error" : "default"}
                  aria-invalid={errors.startDate ? true : undefined}
                  {...form.register("startDate")}
                />
                {errors.startDate && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor={`${prefix}-end-date`}
                  className="text-xs text-muted-foreground"
                >
                  End Date
                </Label>
                <Input
                  id={`${prefix}-end-date`}
                  type="date"
                  min={startDate || bounds?.startDate}
                  max={bounds?.endDate ?? undefined}
                  variant={errors.endDate ? "error" : "default"}
                  aria-invalid={errors.endDate ? true : undefined}
                  {...form.register("endDate")}
                />
                {errors.endDate && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor={`${prefix}-description`}
                className="text-xs text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id={`${prefix}-description`}
                placeholder="Description"
                className="min-h-24"
                value={details?.description ?? ""}
                readOnly
                disabled
              />
            </div>

            <MultiselectField
              id={`${prefix}-environment`}
              label="Environment"
              placeholder="Environment"
              options={environmentOptions}
              value={details?.environment ?? []}
              disabled
            />

            <Controller
              control={form.control}
              name="roles"
              render={({ field }) => (
                <MultiselectField
                  id={`${prefix}-roles`}
                  name={field.name}
                  label="Roles"
                  placeholder="Roles"
                  options={roleOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.roles?.message}
                  display="text"
                  required
                />
              )}
            />

            <div className="space-y-1">
              <Label
                htmlFor={`${prefix}-responsibilities`}
                className="text-xs text-muted-foreground"
              >
                Responsibilities
              </Label>
              <Textarea
                id={`${prefix}-responsibilities`}
                placeholder="Responsibilities"
                {...form.register("responsibilities")}
              />
            </div>

            {formError && (
              <p role="alert" className="text-xs text-destructive">
                {formError}
              </p>
            )}
          </div>

          <DialogFooter className="mt-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit}
            >
              {isAdd ? "Add" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
