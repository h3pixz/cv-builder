"use client";

import {
  ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useEffect,
  useRef,
  useMemo,
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  ClipboardEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full min-w-0 h-8 px-2 py-1 rounded-none border bg-background text-foreground text-xs shadow-none outline-none transition-colors placeholder:text-text-tertiary hover:border-control-border focus-visible:border-control-border disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground disabled:opacity-100",
  {
    variants: {
      variant: {
        default: "",
        error:
          "border-destructive hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps
  extends
    ComponentPropsWithoutRef<"input">,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-slot="input"
        data-variant={variant}
        className={cn(inputVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative flex w-full items-center">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          variant={variant}
          className={cn("pr-8", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 rounded-sm text-text-tertiary hover:text-foreground transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

// -----------------------------------------------------------------------------
// CodeInput (Verification Code / OTP)
//
// `value` is a contiguous string of digits (no gaps). Digits can only be
// entered at the first empty slot or over an existing digit, so the string
// never has holes and each digit always renders in the box it was typed in.
// -----------------------------------------------------------------------------

export interface CodeInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  variant?: VariantProps<typeof inputVariants>["variant"];
  disabled?: boolean;
  className?: string;
  /** Focus the first empty box on mount. Default: true. */
  autoFocus?: boolean;
  /** Submit the parent <form> once every box is filled. Default: true. */
  submitOnComplete?: boolean;
}

const CodeInput = forwardRef<HTMLDivElement, CodeInputProps>(
  (
    {
      length = 6,
      value = "",
      onChange,
      onComplete,
      variant = "default",
      disabled = false,
      className,
      autoFocus = true,
      submitOnComplete = true,
    },
    ref,
  ) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Normalize: digits only, capped at `length`.
    const digits = useMemo(
      () => value.replace(/\D/g, "").slice(0, length),
      [value, length],
    );

    const digitsRef = useRef(digits);
    digitsRef.current = digits;

    useEffect(() => {
      if (autoFocus && !disabled) {
        const first = inputRefs.current[Math.min(digits.length, length - 1)];
        first?.focus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const wasComplete = useRef(digits.length === length);
    useEffect(() => {
      const isComplete = digits.length === length;
      if (isComplete && !wasComplete.current) {
        onComplete?.(digits);
        if (submitOnComplete && !disabled) {
          inputRefs.current[0]?.form?.requestSubmit();
        }
      }
      wasComplete.current = isComplete;
    }, [digits, length, onComplete, submitOnComplete, disabled]);

    const codeArray = useMemo(
      () => Array.from({ length }, (_, i) => digits[i] ?? ""),
      [digits, length],
    );

    const focusInput = (index: number) => {
      const target =
        inputRefs.current[Math.max(0, Math.min(index, length - 1))];
      if (target) {
        target.focus();
        target.select();
      }
    };

    const commit = (next: string) => {
      digitsRef.current = next;
      onChange?.(next);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const raw = e.target.value;

      if (raw === "") {
        if (index < digits.length) {
          commit(digits.slice(0, index) + digits.slice(index + 1));
        }
        return;
      }

      const digit = raw.replace(/\D/g, "").slice(-1);
      if (!digit) return;

      const target = Math.min(index, digits.length);
      const next = digits.slice(0, target) + digit + digits.slice(target + 1);

      commit(next);

      if (target < length - 1) {
        focusInput(target + 1);
      }
    };

    const handleKeyDown = (
      e: KeyboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (index < digits.length) {
          commit(digits.slice(0, index) + digits.slice(index + 1));
        } else if (index > 0) {
          commit(digits.slice(0, index - 1) + digits.slice(index));
          focusInput(index - 1);
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        if (index < digits.length) {
          commit(digits.slice(0, index) + digits.slice(index + 1));
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasteData = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);

      if (!pasteData) return;

      commit(pasteData);
      focusInput(Math.min(pasteData.length, length - 1));
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>, index: number) => {
      if (index > digitsRef.current.length) {
        focusInput(digitsRef.current.length);
        return;
      }
      e.target.select();
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Verification code"
        className={cn("flex items-center gap-4", className)}
      >
        {codeArray.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={variant === "error" || undefined}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={(e) => handleFocus(e, index)}
            className={cn(
              "flex size-10 sm:size-12 text-center text-sm font-medium rounded-none border bg-background text-foreground shadow-none outline-none transition-colors",
              "hover:border-control-border focus-visible:border-control-border",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground",
              variant === "error" &&
                "border-destructive hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              variant === "default" && "border-input",
            )}
          />
        ))}
      </div>
    );
  },
);

CodeInput.displayName = "CodeInput";

export { Input, inputVariants, PasswordInput, CodeInput };
