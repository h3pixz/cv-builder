"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { toast } from "@/shared/ui/toast";

import {
  createSkillAction,
  updateSkillAction,
} from "../../api/catalog.actions";
import {
  SKILL_NAME_MAX,
  catalogSkillSchema,
  type CatalogSkillValues,
} from "../../model/skill-schema";
import type {
  SkillCategoryOption,
  SkillRecord,
} from "../../model/skill-record";

type SkillDialogProps = {
  mode: "create" | "update";
  skill?: SkillRecord | null;
  categories: SkillCategoryOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function SkillForm({
  mode,
  skill,
  categories,
  onCancel,
  onDone,
}: {
  mode: "create" | "update";
  skill?: SkillRecord | null;
  categories: SkillCategoryOption[];
  onCancel: () => void;
  onDone: () => void;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const isCreate = mode === "create";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CatalogSkillValues>({
    resolver: zodResolver(catalogSkillSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: skill?.name ?? "",
      categoryId: skill?.categoryId ?? "",
    },
  });

  const name = useWatch({ control, name: "name" });
  const categoryId = useWatch({ control, name: "categoryId" });

  const options = categories.some(
    (option) => option.value === skill?.categoryId,
  )
    ? categories
    : skill
      ? [
          ...categories,
          {
            value: skill.categoryId,
            label: skill.category,
            typeName: skill.type,
          },
        ]
      : categories;

  const selected = options.find((option) => option.value === categoryId);
  const isComplete = name.trim().length > 0 && categoryId.length > 0;

  async function onSubmit(values: CatalogSkillValues) {
    setFormError(null);

    const result =
      isCreate || !skill
        ? await createSkillAction(values)
        : await updateSkillAction(skill.id, values);

    if (!result.success) {
      setFormError(result.error);

      if (result.field === "name" || result.field === "categoryId") {
        setError(result.field, { message: result.error });
      }

      toast.add({
        type: "error",
        title: isCreate
          ? "Could not create the skill"
          : "Could not update the skill",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: isCreate ? "Skill created" : "Skill updated",
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
        <Input
          id="skill-name"
          placeholder="Skill"
          maxLength={SKILL_NAME_MAX}
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
        <Combobox
          items={options}
          value={selected ?? null}
          onValueChange={(option) =>
            setValue("categoryId", option?.value ?? "", {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          disabled={options.length === 0}
          required
        >
          <ComboboxInput
            id="skill-category"
            placeholder="Category"
            className="rounded-none"
            disabled={options.length === 0}
            aria-invalid={errors.categoryId ? true : undefined}
            aria-describedby={
              errors.categoryId ? "skill-category-error" : undefined
            }
          />
          <ComboboxContent>
            <ComboboxEmpty>No categories found</ComboboxEmpty>
            <ComboboxList>
              {(option: SkillCategoryOption) => (
                <ComboboxItem key={option.value} value={option}>
                  {option.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {errors.categoryId && (
          <p
            id="skill-category-error"
            role="alert"
            className="mt-1 text-xs text-destructive"
          >
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          id="skill-type"
          value={selected?.typeName ?? ""}
          placeholder="Type"
          disabled
          readOnly
        />
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
          disabled={isSubmitting || !isComplete}
        >
          {isCreate ? "Create" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function SkillDialog({
  mode,
  skill,
  categories,
  open,
  onOpenChange,
}: SkillDialogProps) {
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Create skill" : "Edit skill"}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Add a new skill to the catalog."
              : "Update the skill name or category."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <SkillForm
            key={skill?.id ?? "create"}
            mode={mode}
            skill={skill}
            categories={categories}
            onCancel={() => onOpenChange(false)}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
