"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "cn";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const Select = SelectPrimitive.Root;

const selectItemClassName = cn(
  "relative flex h-[46px] w-full cursor-default items-center gap-2.5 px-2.5 text-base outline-hidden select-none",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "not-data-selected:data-highlighted:bg-secondary-hover not-data-selected:data-highlighted:text-foreground",
  "dark:not-data-selected:data-highlighted:bg-disabled dark:not-data-selected:data-highlighted:text-foreground",
  "data-selected:bg-secondary-active data-selected:text-secondary-active-foreground",
  "dark:data-selected:bg-secondary-hover dark:data-selected:text-secondary-hover-foreground",
);

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "group flex w-full items-center justify-between gap-2 rounded-none border border-control-border bg-transparent px-2.5 text-left text-base whitespace-nowrap text-foreground transition-colors select-none",
        "hover:border-foreground data-popup-open:border-foreground focus-visible:border-foreground",
        "data-disabled:cursor-not-allowed data-disabled:border-border data-disabled:bg-disabled data-disabled:text-disabled-foreground data-disabled:hover:border-border",
        "aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:data-popup-open:border-destructive",
        "data-[size=default]:min-h-11.5 data-[size=sm]:min-h-9",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        className={cn(
          "flex shrink-0 self-center text-foreground transition-transform",
          "group-data-popup-open:rotate-180",
          "group-data-disabled:text-disabled-foreground",
          "group-aria-invalid:text-destructive",
        )}
      >
        <ChevronDownIcon />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = -1,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-none border border-foreground bg-background text-foreground shadow-none duration-100",
            "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-2.5 py-1 text-xs text-text-secondary", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(selectItemClassName, className)}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-background py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-background py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

function SelectFieldShell({
  label,
  floated,
  disabled,
  error,
  errorId,
  className,
  children,
}: {
  label?: string;
  floated?: boolean;
  disabled?: boolean;
  error?: string;
  errorId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="select-field"
      className={cn("relative w-full pt-4", className)}
    >
      {label && (
        <span
          className={cn(
            "pointer-events-none absolute top-0 left-2.5 text-xs leading-4 text-foreground transition-opacity",
            disabled && "text-text-tertiary",
            floated ? "opacity-100" : "opacity-0",
          )}
        >
          {label}
        </span>
      )}
      {children}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1 px-2.5 text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectFieldShell,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectItemClassName,
};
