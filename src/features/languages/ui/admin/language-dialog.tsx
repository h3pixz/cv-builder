"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

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
import { toast } from "@/shared/ui/toast";

import {
  createLanguageAction,
  updateLanguageAction,
} from "../../api/catalog.actions";
import {
  LANGUAGE_ISO_MAX,
  LANGUAGE_NAME_MAX,
  catalogLanguageSchema,
  type CatalogLanguageValues,
} from "../../model/language-schema";
import type { LanguageRecord } from "../../model/language-record";

type LanguageDialogProps = {
  mode: "create" | "update";
  language?: LanguageRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function LanguageForm({
  mode,
  language,
  onCancel,
  onDone,
}: {
  mode: "create" | "update";
  language?: LanguageRecord | null;
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
  } = useForm<CatalogLanguageValues>({
    resolver: zodResolver(catalogLanguageSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: language?.name ?? "",
      iso2: language?.iso2 ?? "",
      nativeName: language?.nativeName ?? "",
    },
  });

  const name = useWatch({ control, name: "name" });
  const iso2 = useWatch({ control, name: "iso2" });
  const nativeName = useWatch({ control, name: "nativeName" });

  const isComplete =
    name.trim().length > 0 &&
    iso2.trim().length > 0 &&
    nativeName.trim().length > 0;

  async function onSubmit(values: CatalogLanguageValues) {
    setFormError(null);

    const result =
      isCreate || !language
        ? await createLanguageAction(values)
        : await updateLanguageAction(language.id, values);

    if (!result.success) {
      setFormError(result.error);

      if (
        result.field === "name" ||
        result.field === "iso2" ||
        result.field === "nativeName"
      ) {
        setError(result.field, { message: result.error });
      }

      toast.add({
        type: "error",
        title: isCreate
          ? "Could not create the language"
          : "Could not update the language",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: isCreate ? "Language created" : "Language updated",
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
          id="language-name"
          placeholder="Name"
          maxLength={LANGUAGE_NAME_MAX}
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
        <Input
          id="language-iso"
          placeholder="ISO"
          maxLength={LANGUAGE_ISO_MAX}
          variant={errors.iso2 ? "error" : "default"}
          aria-invalid={errors.iso2 ? true : undefined}
          value={iso2}
          onChange={(event) =>
            setValue("iso2", event.target.value.toUpperCase(), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
        {errors.iso2 && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {errors.iso2.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          id="language-native-name"
          placeholder="Native Name"
          variant={errors.nativeName ? "error" : "default"}
          aria-invalid={errors.nativeName ? true : undefined}
          {...register("nativeName")}
        />
        {errors.nativeName && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {errors.nativeName.message}
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
          disabled={isSubmitting || !isComplete}
        >
          {isCreate ? "Create" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function LanguageDialog({
  mode,
  language,
  open,
  onOpenChange,
}: LanguageDialogProps) {
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create language" : "Edit language"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Add a new language to the catalog."
              : "Update the language details."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <LanguageForm
            key={language?.id ?? "create"}
            mode={mode}
            language={language}
            onCancel={() => onOpenChange(false)}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
