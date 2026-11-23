"use client";

import * as React from "react";
import { cn } from "cn";
import type { Locale, Matcher } from "react-day-picker";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

type View = "days" | "months" | "years";

const YEARS_PER_PAGE = 12;

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabledDates?: Matcher | Matcher[];
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  locale?: Partial<Locale>;
  className?: string;
};

function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = "Select date",
  disabledDates,
  disabled,
  id,
  name,
  locale,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<View>("days");
  const [month, setMonth] = React.useState<Date>(() =>
    startOfMonth(value ?? new Date()),
  );
  const [yearStart, setYearStart] = React.useState(
    () => month.getFullYear() - 3,
  );

  const lang = locale?.code;
  const year = month.getFullYear();

  const monthNames = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new Date(2000, i, 1).toLocaleString(lang, { month: "long" }),
      ),
    [lang],
  );

  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearStart + i);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      const start = startOfMonth(value ?? new Date());
      setMonth(start);
      setYearStart(start.getFullYear() - 3);
      setView("days");
    } else {
      onBlur?.();
    }
  };

  const shift = (dir: 1 | -1) => {
    if (view === "days") {
      setMonth(new Date(year, month.getMonth() + dir, 1));
    } else if (view === "months") {
      setMonth(new Date(year + dir, month.getMonth(), 1));
    } else {
      setYearStart((y) => y + dir * YEARS_PER_PAGE);
    }
  };

  const toggleView = (target: Exclude<View, "days">) => {
    if (view === target) {
      setView("days");
      return;
    }
    if (target === "years") setYearStart(year - 3);
    setView(target);
  };

  const label = value
    ? value.toLocaleDateString(lang, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <button
            id={id}
            name={name}
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm outline-none",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
          />
        }
      >
        <span className={cn(!label && "text-muted-foreground")}>
          {label ?? placeholder}
        </span>
        <CalendarIcon className="size-4 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-3">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm font-medium">
              <button
                type="button"
                onClick={() => toggleView("months")}
                className={cn(
                  "rounded-sm px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  view === "months" && "text-primary",
                )}
              >
                {monthNames[month.getMonth()]}
              </button>
              <button
                type="button"
                onClick={() => toggleView("years")}
                className={cn(
                  "rounded-sm px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  view === "years" && "text-primary",
                )}
              >
                {year}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="icon"
                aria-label="Previous"
                onClick={() => shift(-1)}
                className="size-8 rounded-full p-0"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                type="button"
                variant="icon"
                aria-label="Next"
                onClick={() => shift(1)}
                className="size-8 rounded-full p-0"
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="min-h-70">
            {view === "days" && (
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => {
                  onChange?.(date);
                  if (date) handleOpenChange(false);
                }}
                month={month}
                onMonthChange={setMonth}
                hideNavigation
                disabled={disabledDates}
                locale={locale as Locale | undefined}
                formatters={{
                  formatWeekdayName: (date) =>
                    date.toLocaleDateString(lang, { weekday: "narrow" }),
                }}
                className="w-full p-0 [--cell-radius:9999px] [--cell-size:--spacing(2)]"
                classNames={{
                  month_caption: "hidden",
                  weekday:
                    "flex-1 text-xs font-semibold text-foreground select-none",
                  disabled:
                    "text-muted-foreground opacity-50 [&>button]:line-through",
                }}
              />
            )}

            {view === "months" && (
              <PickerGrid>
                {monthNames.map((name, i) => (
                  <PickerItem
                    key={name}
                    selected={i === month.getMonth()}
                    onClick={() => {
                      setMonth(new Date(year, i, 1));
                      setView("days");
                    }}
                  >
                    {name}
                  </PickerItem>
                ))}
              </PickerGrid>
            )}

            {view === "years" && (
              <PickerGrid>
                {years.map((y) => (
                  <PickerItem
                    key={y}
                    selected={y === year}
                    onClick={() => {
                      setMonth(new Date(y, month.getMonth(), 1));
                      setView("months");
                    }}
                  >
                    {y}
                  </PickerItem>
                ))}
              </PickerGrid>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PickerGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-70 grid-cols-3 content-center gap-x-2 gap-y-3">
      {children}
    </div>
  );
}

function PickerItem({
  selected,
  className,
  ...props
}: React.ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "h-9 rounded-md text-sm outline-none transition-colors",
        "hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50",
        selected && "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      {...props}
    />
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export { DatePicker };
export type { DatePickerProps };
