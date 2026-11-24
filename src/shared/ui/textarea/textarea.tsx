import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex w-full min-w-0 min-h-20 px-2 py-2 rounded-none border bg-background text-foreground text-xs leading-relaxed shadow-none outline-none transition-colors placeholder:text-text-tertiary hover:border-control-border focus-visible:border-control-border resize-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground disabled:opacity-100 aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20",
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

export interface TextareaProps
  extends
    ComponentPropsWithoutRef<"textarea">,
    VariantProps<typeof textareaVariants> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        data-variant={variant}
        className={cn(textareaVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
