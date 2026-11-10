"use client";

import { useState, useId } from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "cn";
import { CheckIcon, XIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectFieldShell,
  SelectTrigger,
  selectItemClassName,
} from "./select";
import type { SelectOption } from "./select-field";

export type MultiselectFieldOption = SelectOption;

export interface MultiselectFieldProps {
  options: MultiselectFieldOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

function Chip({
  label,
  disabled,
  onRemove,
}: {
  label: string;
  disabled?: boolean;
  onRemove: () => void;
}) {
  return (
    <span
      data-slot="MultiselectField-chip"
      className={cn(
        "inline-flex h-7 max-w-full items-center gap-1.5 rounded-full border border-control-border bg-transparent pr-1.5 pl-3 text-sm text-foreground",
        "group-data-disabled:border-border group-data-disabled:text-disabled-foreground",
      )}
    >
      <span className="truncate">{label}</span>
      <span
        role="button"
        tabIndex={-1}
        aria-label={`Remove ${label}`}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onRemove();
        }}
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full bg-text-secondary text-background transition-colors",
          !disabled && "hover:bg-foreground",
          disabled &&
            "pointer-events-none bg-disabled-foreground/60 text-disabled",
        )}
      >
        <XIcon className="size-2.5!" strokeWidth={3} />
      </span>
    </span>
  );
}

function MultiselectField({
  options,
  value,
  defaultValue = [],
  onValueChange,
  label,
  placeholder,
  error,
  disabled,
  required,
  name,
  id,
  className,
}: MultiselectFieldProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const errorId = useId();

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const update = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;

  return (
    <SelectFieldShell
      label={label ?? placeholder}
      floated={open || current.length > 0}
      disabled={disabled}
      error={error}
      errorId={errorId}
      className={className}
    >
      <Select
        multiple
        value={current}
        onValueChange={(next) => update(next as string[])}
        open={open}
        onOpenChange={setOpen}
        disabled={disabled}
        required={required}
        name={name}
      >
        <SelectTrigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={current.length > 0 ? "py-1.75" : undefined}
        >
          {current.length === 0 ? (
            <span className="truncate text-text-tertiary group-aria-invalid:text-destructive/50">
              {placeholder}
            </span>
          ) : (
            <span className="flex min-w-0 flex-1 flex-wrap gap-2 whitespace-normal">
              {current.map((v) => (
                <Chip
                  key={v}
                  label={labelOf(v)}
                  disabled={disabled}
                  onRemove={() => update(current.filter((x) => x !== v))}
                />
              ))}
            </span>
          )}
        </SelectTrigger>

        <SelectContent>
          {options.map((o) => (
            <SelectPrimitive.Item
              key={o.value}
              value={o.value}
              label={o.label}
              disabled={o.disabled}
              data-slot="MultiselectField-item"
              className={selectItemClassName}
            >
              <span className="flex size-5 shrink-0 items-center justify-center border border-current">
                <SelectPrimitive.ItemIndicator>
                  <CheckIcon className="size-4" strokeWidth={2.5} />
                </SelectPrimitive.ItemIndicator>
              </span>
              <SelectPrimitive.ItemText className="flex-1 whitespace-nowrap">
                {o.label}
              </SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
          ))}
        </SelectContent>
      </Select>
    </SelectFieldShell>
  );
}

export { MultiselectField };
