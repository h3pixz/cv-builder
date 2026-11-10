"use client";

import { useState, useId } from "react";
import { cn } from "cn";

import {
  Select,
  SelectContent,
  SelectFieldShell,
  SelectItem,
  SelectTrigger,
} from "./select";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

function SelectField({
  options,
  value,
  defaultValue = null,
  onValueChange,
  label,
  placeholder,
  error,
  disabled,
  required,
  name,
  id,
  className,
}: SelectFieldProps) {
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const errorId = useId();

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const selected = options.find((o) => o.value === current);

  return (
    <SelectFieldShell
      label={label ?? placeholder}
      floated={open || current != null}
      disabled={disabled}
      error={error}
      errorId={errorId}
      className={className}
    >
      <Select
        value={current}
        onValueChange={(next) => {
          const v = (next as string | null) ?? null;
          if (!isControlled) setInternal(v);
          onValueChange?.(v);
        }}
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
        >
          <span
            className={cn(
              "truncate",
              !selected &&
                "text-text-tertiary group-aria-invalid:text-destructive/50",
            )}
          >
            {selected?.label ?? placeholder}
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              label={o.label}
              disabled={o.disabled}
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SelectFieldShell>
  );
}

export { SelectField };
