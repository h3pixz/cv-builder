import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-6 py-2 text-[10px] leading-none font-semibold uppercase tracking-[0.02em] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-transparent text-primary hover:border-primary hover:bg-primary-hover hover:text-primary-hover-foreground active:border-primary active:bg-primary-active active:text-primary-active-foreground disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground",

        primary:
          "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary-hover hover:text-primary-hover-foreground active:border-primary active:bg-primary-active active:text-primary-active-foreground disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground",

        secondary:
          "border-control-border bg-background text-secondary-foreground hover:border-secondary-active hover:bg-secondary-hover hover:text-secondary-hover-foreground active:border-secondary-active active:bg-secondary-active active:text-secondary-active-foreground disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground",

        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:border-control-border hover:bg-background hover:text-muted-foreground active:border-secondary-hover active:bg-secondary-hover active:text-secondary-hover-foreground disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground",

        icon: "border-transparent bg-transparent p-2 text-muted-foreground hover:border-control-border hover:bg-background hover:text-foreground active:border-secondary-hover active:bg-secondary-hover active:text-secondary-hover-foreground disabled:border-transparent disabled:bg-transparent disabled:text-disabled-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
