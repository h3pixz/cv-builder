"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import type { LevelGroup } from "@/shared/helpers";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
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
  addCvSkillAction,
  removeCvSkillsAction,
  updateCvSkillAction,
} from "../api/cv-skills.actions";
import { cvSkillSchema, type CvSkillValues } from "../model/cv-skill-schema";

type SkillItem = LevelGroup["items"][number];

type Props = {
  cvId: string;
  groups: LevelGroup[];
  options: SelectOption[];
};

function SkillRow({
  item,
  selectionMode,
  selected,
  onSelect,
}: {
  item: SkillItem;
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
        <Level level={item.level} barClassName="w-12" />
        <span className="w-16 text-right text-xs text-muted-foreground">
          {item.levelLabel}
        </span>
      </span>
    </>
  );

  const className = cn(
    "flex w-full items-center gap-2 px-2 py-1.5 text-left transition-colors",
    selectionMode
      ? "cursor-pointer"
      : "cursor-pointer hover:bg-secondary-foreground hover:text-primary-hover",
    selected && "bg-secondary-foreground text-primary-hover",
  );

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
      className={cn(
        className,
        "focus-visible:bg-secondary-foreground focus-visible:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
      )}
      onClick={onSelect}
      aria-label={`Update ${item.name}`}
    >
      {details}
    </button>
  );
}

export function CvSkillsManager({ cvId, groups, options }: Props) {
  const router = useRouter();

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<SkillItem | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const addForm = useForm<CvSkillValues>({
    resolver: zodResolver(cvSkillSchema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const updateForm = useForm<CvSkillValues>({
    resolver: zodResolver(cvSkillSchema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const items = groups.flatMap((group) => group.items);
  const assigned = new Set(items.map((item) => item.name));
  const availableOptions = options.filter(
    (option) => !assigned.has(option.value),
  );

  const addName = useWatch({ control: addForm.control, name: "name" });
  const updateName = useWatch({ control: updateForm.control, name: "name" });

  function toggleSelected(name: string) {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  function onItemSelect(item: SkillItem) {
    if (selectionMode) {
      toggleSelected(item.name);
      return;
    }

    setUpdateError(null);
    updateForm.reset({ name: item.name });
    setEditing(item);
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

  async function onAdd(values: CvSkillValues) {
    setAddError(null);

    const result = await addCvSkillAction(cvId, values.name);

    if (!result.success) {
      setAddError(result.error);
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

  async function onUpdate(values: CvSkillValues) {
    if (!editing) {
      return;
    }

    setUpdateError(null);

    const result = await updateCvSkillAction(cvId, editing.name, values.name);

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
      const result = await removeCvSkillsAction(cvId, selected);

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
      cancelSelection();
      router.refresh();
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No skills added yet</p>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.id} className="space-y-2">
              <h3 className="text-sm font-medium">{group.name}</h3>
              <ul className="grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <SkillRow
                      item={item}
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

      <div className="mt-10 flex flex-wrap justify-end gap-4">
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
              Add skill
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => setSelectionMode(true)}
              disabled={items.length === 0}
            >
              <Trash2Icon className="size-4" />
              Remove skills
            </Button>
          </>
        )}
      </div>

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
              <Label
                htmlFor="cv-skill-add-name"
                className="text-[10px] text-muted-foreground"
              >
                Skill
              </Label>
              <Controller
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <SelectField
                    id="cv-skill-add-name"
                    name={field.name}
                    placeholder="Skill"
                    options={availableOptions}
                    value={field.value || null}
                    onValueChange={(value) =>
                      field.onChange(value ?? "")
                    }
                    error={addForm.formState.errors.name?.message}
                    disabled={availableOptions.length === 0}
                    required
                  />
                )}
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
                disabled={!addName || addForm.formState.isSubmitting}
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
                htmlFor="cv-skill-update-name"
                className="text-[10px] text-muted-foreground"
              >
                Skill
              </Label>
              <Controller
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <SelectField
                    id="cv-skill-update-name"
                    name={field.name}
                    placeholder="Skill"
                    options={
                      editing
                        ? [
                            {
                              value: editing.name,
                              label: editing.name,
                            },
                            ...availableOptions,
                          ]
                        : []
                    }
                    value={field.value || null}
                    onValueChange={(value) =>
                      field.onChange(value ?? "")
                    }
                    error={updateForm.formState.errors.name?.message}
                    disabled={updateForm.formState.isSubmitting}
                    required
                  />
                )}
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
                disabled={!updateName || updateForm.formState.isSubmitting}
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
            <DialogTitle>Remove skills</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selected.length} skills?
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
