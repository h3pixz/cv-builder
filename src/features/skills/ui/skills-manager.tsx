"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
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
import { Label } from "@/shared/ui/label";
import { Level } from "@/shared/ui/level";
import { SelectField, type SelectOption } from "@/shared/ui/select";
import { toast } from "@/shared/ui/toast";

import {
  addMySkillAction,
  deleteMySkillsAction,
  updateMySkillAction,
} from "../api/profile-skills.actions";
import { skillFormSchema, type SkillFormValues } from "../model/skill-schema";
import {
  SKILL_MASTERY_VALUES,
  type SkillMasteryValue,
} from "../model/skill-levels";

export type SkillGroupView = {
  id: string;
  name: string;
  items: {
    name: string;
    level: number;
    levelLabel: string;
  }[];
};

export type SkillOption = SelectOption & { categoryId?: string | null };

type Props = {
  groups: SkillGroupView[];
  options: SkillOption[];
  canManage?: boolean;
};

const MASTERY_OPTIONS: SelectOption[] = SKILL_MASTERY_VALUES.map((value) => ({
  value,
  label: value,
}));

function SkillRow({
  item,
  interactive,
  selectionMode,
  selected,
  onSelect,
}: {
  item: SkillGroupView["items"][number];
  interactive: boolean;
  selectionMode: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const details = (
    <>
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
      "cursor-pointer hover:bg-secondary-foreground hover:text-primary-hover focus-visible:bg-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
    selected && "bg-secondary-foreground text-primary-hover",
  );

  if (!interactive) {
    return <div className={className}>{details}</div>;
  }

  if (selectionMode) {
    return (
      <Label className={className}>
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect()}
          aria-label={`${selected ? "Deselect" : "Select"} ${item.name}`}
        />
        {details}
      </Label>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onSelect}
      aria-label={`Update ${item.name}`}
    >
      {details}
    </button>
  );
}

export function SkillsManager({ groups, options, canManage = true }: Props) {
  const router = useRouter();

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<
    SkillGroupView["items"][number] | null
  >(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const addForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { name: "", mastery: "" },
  });

  const updateForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
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

  function onItemSelect(item: SkillGroupView["items"][number]) {
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

  async function onAdd(values: SkillFormValues) {
    setAddError(null);

    const option = availableOptions.find(
      (candidate) => candidate.value === values.name,
    );

    const result = await addMySkillAction({
      name: values.name,
      mastery: values.mastery as SkillMasteryValue,
      categoryId: option?.categoryId,
    });

    if (!result.success) {
      setAddError(result.error);

      if (result.field === "name") {
        addForm.setError("name", { message: result.error });
      }

      toast.add({
        type: "error",
        title: "Could not add the skill",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Skill added",
      description: `${values.name} has been added.`,
    });
    onAddOpenChange(false);
    router.refresh();
  }

  async function onUpdate(values: SkillFormValues) {
    setUpdateError(null);

    const result = await updateMySkillAction({
      name: values.name,
      mastery: values.mastery as SkillMasteryValue,
    });

    if (!result.success) {
      setUpdateError(result.error);
      toast.add({
        type: "error",
        title: "Could not update the skill",
        description: result.error,
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Skill updated",
      description: `${values.name} has been updated.`,
    });
    setEditing(null);
    router.refresh();
  }

  async function onRemove() {
    setIsRemoving(true);

    try {
      const result = await deleteMySkillsAction(selected);

      if (!result.success) {
        toast.add({
          type: "error",
          title: "Could not remove the skills",
          description: result.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Skills removed",
        description: `${selected.length} ${
          selected.length === 1 ? "skill" : "skills"
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

  const addSelected =
    availableOptions.find((option) => option.value === addName) ?? null;
  const updateSkillOptions = editing
    ? [{ value: editing.name, label: editing.name }]
    : [];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-lg font-semibold text-foreground">Current skills</h1>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No skills added yet</p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.id} className="space-y-2">
              <h2 className="text-xs font-semibold text-foreground">
                {group.name}
              </h2>
              <ul className="grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <SkillRow
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
                Delete ({selected.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAddOpen(true)}
                disabled={availableOptions.length === 0}
              >
                <PlusIcon className="size-4" />
                Add skill
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={startSelection}
                disabled={items.length === 0}
              >
                <Trash2Icon className="size-4" />
                Remove skills
              </Button>
            </>
          )}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={onAddOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add skill</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            noValidate
            onSubmit={addForm.handleSubmit(onAdd)}
          >
            <div className="space-y-1">
              <Combobox
                items={availableOptions}
                value={addSelected}
                onValueChange={(option) =>
                  addForm.setValue("name", option?.value ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={availableOptions.length === 0}
                required
              >
                <ComboboxInput
                  id="add-skill-name"
                  placeholder="Skill"
                  className="rounded-none"
                  disabled={availableOptions.length === 0}
                  aria-invalid={
                    addForm.formState.errors.name ? true : undefined
                  }
                  aria-describedby={
                    addForm.formState.errors.name
                      ? "add-skill-name-error"
                      : undefined
                  }
                />
                <ComboboxContent>
                  <ComboboxEmpty>No skills found</ComboboxEmpty>
                  <ComboboxList>
                    {(option: SkillOption) => (
                      <ComboboxItem key={option.value} value={option}>
                        {option.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {addForm.formState.errors.name && (
                <p
                  id="add-skill-name-error"
                  role="alert"
                  className="mt-1 text-xs text-destructive"
                >
                  {addForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <SelectField
                id="add-skill-mastery"
                name="mastery"
                placeholder="Skill Mastery"
                options={MASTERY_OPTIONS}
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
                  !addName || !addMastery || addForm.formState.isSubmitting
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
            <DialogTitle>Update skill</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            noValidate
            onSubmit={updateForm.handleSubmit(onUpdate)}
          >
            <div className="space-y-1">
              <Label
                htmlFor="update-skill-name"
                className="text-[10px] text-muted-foreground"
              >
                Skill
              </Label>
              <Combobox
                items={updateSkillOptions}
                value={updateSkillOptions[0] ?? null}
                disabled
              >
                <ComboboxInput
                  id="update-skill-name"
                  placeholder="Skill"
                  className="rounded-none"
                  disabled
                />
                <ComboboxContent>
                  <ComboboxEmpty>No skills found</ComboboxEmpty>
                  <ComboboxList>
                    {(option: SkillOption) => (
                      <ComboboxItem key={option.value} value={option}>
                        {option.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="update-skill-mastery"
                className="text-[10px] text-muted-foreground"
              >
                Skill Mastery
              </Label>
              <SelectField
                id="update-skill-mastery"
                name="mastery"
                placeholder="Skill Mastery"
                options={MASTERY_OPTIONS}
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
                disabled={!updateMastery || updateForm.formState.isSubmitting}
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove skill</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to remove ${selected.length} ${
                selected.length === 1 ? "skill" : "skills"
              }?`}
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
