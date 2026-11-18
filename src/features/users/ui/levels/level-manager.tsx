"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Level } from "@/shared/ui/level";
import { SelectField, type SelectOption } from "@/shared/ui/select";
import { toast } from "@/shared/ui/toast";

import {
  addLanguageAction,
  addSkillAction,
  deleteLanguagesAction,
  deleteSkillsAction,
  updateLanguageAction,
  updateSkillAction,
} from "../../api/profile-levels.actions";
import {
  createLevelFormSchema,
  LANGUAGE_FORM_MESSAGES,
  SKILL_FORM_MESSAGES,
  type LevelFormValues,
} from "../../model/level-forms";
import {
  LANGUAGE_PROFICIENCY_VALUES,
  SKILL_MASTERY_VALUES,
  type LanguageProficiencyValue,
  type LevelGroup,
  type SkillMasteryValue,
} from "../../model/levels";

export type LevelOption = SelectOption & { categoryId?: string | null };

type LevelKind = "skill" | "language";

type Props = {
  kind: LevelKind;
  userId: string;
  heading: string;
  groups: LevelGroup[];
  options: LevelOption[];
  canManage: boolean;
  /** Skills are grouped by category, languages live in a single section. */
  showGroupNames?: boolean;
};

const FORM_SCHEMAS = {
  skill: createLevelFormSchema(SKILL_FORM_MESSAGES),
  language: createLevelFormSchema(LANGUAGE_FORM_MESSAGES),
};

const LEVEL_OPTIONS: Record<LevelKind, SelectOption[]> = {
  skill: SKILL_MASTERY_VALUES.map((value) => ({ value, label: value })),
  language: LANGUAGE_PROFICIENCY_VALUES.map((value) => ({
    value,
    label: value,
  })),
};

const CONFIG = {
  skill: {
    addTitle: "Add skill",
    updateTitle: "Update skill",
    removeTitle: "Remove skills",
    nameLabel: "Skill",
    levelLabel: "Skill Mastery",
    emptyMessage: "No skills added yet",
    removeQuestion: (count: number) =>
      `Are you sure you want to remove ${count} skills?`,
  },
  language: {
    addTitle: "Add language",
    updateTitle: "Update language",
    removeTitle: "Remove languages",
    nameLabel: "Language",
    levelLabel: "Language Proficiency",
    emptyMessage: "No languages added yet",
    removeQuestion: (count: number) =>
      `Are you sure you want to remove ${count} languages?`,
  },
} satisfies Record<LevelKind, unknown>;

function LevelRow({
  item,
  interactive,
  selectionMode,
  selected,
  onSelect,
}: {
  item: LevelGroup["items"][number];
  interactive: boolean;
  selectionMode: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const content = (
    <>
      {selectionMode && (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-4 shrink-0 items-center justify-center border",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-control-border",
          )}
        >
          {selected && <CheckIcon className="size-3" />}
        </span>
      )}

      <span className="label-xl label-label-secondary min-w-0 truncate">
        {item.name}
      </span>

      <span className="ml-auto flex shrink-0 items-center gap-3 pl-2">
        <Level level={item.level} />
        <span className="w-20 text-right text-xs text-muted-foreground">
          {item.levelLabel}
        </span>
      </span>
    </>
  );

  const className = cn(
    "flex w-full items-center gap-2 px-2 py-1.5 text-left transition-colors",
    interactive &&
      "cursor-pointer hover:bg-secondary-hover focus-visible:bg-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
    selected && "bg-secondary-hover",
  );

  if (!interactive) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onSelect}
      aria-pressed={selectionMode ? selected : undefined}
      aria-label={
        selectionMode
          ? `${selected ? "Deselect" : "Select"} ${item.name}`
          : `Update ${item.name}`
      }
    >
      {content}
    </button>
  );
}

export function LevelManager({
  kind,
  userId,
  heading,
  groups,
  options,
  canManage,
  showGroupNames = true,
}: Props) {
  const router = useRouter();
  const config = CONFIG[kind];
  const schema = FORM_SCHEMAS[kind];

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<LevelGroup["items"][number] | null>(
    null,
  );
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const addForm = useForm<LevelFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { name: "", mastery: "" },
  });

  const updateForm = useForm<LevelFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: "", mastery: "" },
  });

  const items = groups.flatMap((group) => group.items);
  const assigned = new Set(items.map((item) => item.name));
  const availableOptions = options.filter(
    (option) => !assigned.has(option.value),
  );

  function toggleSelected(name: string) {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  function onItemSelect(item: LevelGroup["items"][number]) {
    if (!canManage) return;

    if (selectionMode) {
      toggleSelected(item.name);
      return;
    }

    setUpdateError(null);
    updateForm.reset({ name: item.name, mastery: item.levelLabel });
    setEditing(item);
  }

  function startSelection() {
    setSelectionMode(true);
    setSelected([]);
  }

  function cancelSelection() {
    setSelectionMode(false);
    setSelected([]);
    setConfirmOpen(false);
  }

  function onAddOpenChange(open: boolean) {
    setAddOpen(open);

    if (!open) {
      addForm.reset();
      setAddError(null);
    }
  }

  function onUpdateOpenChange(open: boolean) {
    if (!open) {
      setEditing(null);
      setUpdateError(null);
    }
  }

  async function onAdd(values: LevelFormValues) {
    setAddError(null);

    const option = availableOptions.find(
      (candidate) => candidate.value === values.name,
    );

    const result =
      kind === "skill"
        ? await addSkillAction(userId, {
            name: values.name,
            mastery: values.mastery as SkillMasteryValue,
            categoryId: option?.categoryId,
          })
        : await addLanguageAction(userId, {
            name: values.name,
            mastery: values.mastery as LanguageProficiencyValue,
          });

    if (!result.success) {
      setAddError(result.error);
      toast.add({
        type: "error",
        title: `Could not add the ${kind}`,
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: kind === "skill" ? "Skill added" : "Language added",
      description: `${values.name} has been added.`,
    });
    onAddOpenChange(false);
    router.refresh();
  }

  async function onUpdate(values: LevelFormValues) {
    setUpdateError(null);

    const result =
      kind === "skill"
        ? await updateSkillAction(userId, {
            name: values.name,
            mastery: values.mastery as SkillMasteryValue,
          })
        : await updateLanguageAction(userId, {
            name: values.name,
            mastery: values.mastery as LanguageProficiencyValue,
          });

    if (!result.success) {
      setUpdateError(result.error);
      toast.add({
        type: "error",
        title: `Could not update the ${kind}`,
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: kind === "skill" ? "Skill updated" : "Language updated",
      description: `${values.name} has been updated.`,
    });
    setEditing(null);
    router.refresh();
  }

  async function onRemove() {
    setIsRemoving(true);

    try {
      const result =
        kind === "skill"
          ? await deleteSkillsAction(userId, selected)
          : await deleteLanguagesAction(userId, selected);

      if (!result.success) {
        toast.add({
          type: "error",
          title: `Could not remove the ${kind}s`,
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: kind === "skill" ? "Skills removed" : "Languages removed",
        description: `${selected.length} ${
          selected.length === 1 ? kind : `${kind}s`
        } removed.`,
      });
      setConfirmOpen(false);
      setSelectionMode(false);
      setSelected([]);
      router.refresh();
    } finally {
      setIsRemoving(false);
    }
  }

  const addName = useWatch({ control: addForm.control, name: "name" });
  const addMastery = useWatch({ control: addForm.control, name: "mastery" });
  const updateMastery = useWatch({
    control: updateForm.control,
    name: "mastery",
  });

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h2 className="text-sm font-medium">{heading}</h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{config.emptyMessage}</p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.id} className="space-y-2">
              {showGroupNames && (
                <h3 className="text-xs font-semibold text-foreground">
                  {group.name}
                </h3>
              )}
              <ul className="grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <LevelRow
                      item={item}
                      interactive={canManage}
                      selectionMode={selectionMode}
                      selected={selected.includes(item.name)}
                      onSelect={() => onItemSelect(item)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {canManage && (
        <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-10">
          {selectionMode ? (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={cancelSelection}
                disabled={isRemoving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setConfirmOpen(true)}
                disabled={selected.length === 0 || isRemoving}
              >
                <Trash2Icon className="size-4" />
                Remove ({selected.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAddOpen(true)}
              >
                <PlusIcon className="size-4" />
                Add {kind}
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={startSelection}
                disabled={items.length === 0}
              >
                <Trash2Icon className="size-4" />
                Remove {kind}s
              </Button>
            </>
          )}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={onAddOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{config.addTitle}</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            noValidate
            onSubmit={addForm.handleSubmit(onAdd)}
          >
            <div className="space-y-1">
              <Label
                htmlFor="add-level-name"
                className="text-[10px] text-muted-foreground"
              >
                {config.nameLabel}
              </Label>
              <SelectField
                id="add-level-name"
                name="name"
                placeholder={config.nameLabel}
                options={availableOptions}
                value={addName || null}
                onValueChange={(value) =>
                  addForm.setValue("name", value ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={addForm.formState.errors.name?.message}
                disabled={availableOptions.length === 0}
                required
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="add-level-mastery"
                className="text-[10px] text-muted-foreground"
              >
                {config.levelLabel}
              </Label>
              <SelectField
                id="add-level-mastery"
                name="mastery"
                placeholder={config.levelLabel}
                options={LEVEL_OPTIONS[kind]}
                value={addMastery || null}
                onValueChange={(value) =>
                  addForm.setValue("mastery", value ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={addForm.formState.errors.mastery?.message}
                required
              />
            </div>

            {addError && (
              <p role="alert" className="text-xs text-destructive">
                {addError}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onAddOpenChange(false)}
                disabled={addForm.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  !addName ||
                  !addMastery ||
                  addForm.formState.isSubmitting
                }
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onOpenChange={onUpdateOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{config.updateTitle}</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            noValidate
            onSubmit={updateForm.handleSubmit(onUpdate)}
          >
            <div className="space-y-1">
              <Label
                htmlFor="update-level-name"
                className="text-[10px] text-muted-foreground"
              >
                {config.nameLabel}
              </Label>
              <SelectField
                id="update-level-name"
                placeholder={config.nameLabel}
                options={
                  editing
                    ? [{ value: editing.name, label: editing.name }]
                    : []
                }
                value={editing?.name ?? null}
                disabled
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="update-level-mastery"
                className="text-[10px] text-muted-foreground"
              >
                {config.levelLabel}
              </Label>
              <SelectField
                id="update-level-mastery"
                name="mastery"
                placeholder={config.levelLabel}
                options={LEVEL_OPTIONS[kind]}
                value={updateMastery || null}
                onValueChange={(value) =>
                  updateForm.setValue("mastery", value ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={updateForm.formState.errors.mastery?.message}
                required
              />
            </div>

            {updateError && (
              <p role="alert" className="text-xs text-destructive">
                {updateError}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onUpdateOpenChange(false)}
                disabled={updateForm.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  !updateMastery || updateForm.formState.isSubmitting
                }
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{config.removeTitle}</DialogTitle>
            <DialogDescription>
              {config.removeQuestion(selected.length)}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onRemove}
              disabled={isRemoving || selected.length === 0}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
