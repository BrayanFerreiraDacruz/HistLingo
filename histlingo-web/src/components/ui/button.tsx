import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold uppercase tracking-widest ring-offset-background transition-transform duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-1 active:shadow-none select-none",
  {
    variants: {
      variant: {
        default: "bg-(--color-primary) text-(--color-primary-foreground) shadow-neo-primary border-2 border-(--color-primary-dark) hover:brightness-110",
        secondary: "bg-(--color-secondary) text-(--color-secondary-foreground) shadow-neo-secondary border-2 border-(--color-secondary-dark) hover:brightness-110",
        accent: "bg-(--color-accent) text-(--color-accent-foreground) shadow-neo-accent border-2 border-(--color-accent-dark) hover:brightness-110",
        destructive: "bg-(--color-destructive) text-(--color-destructive-foreground) shadow-neo-destructive border-2 border-(--color-destructive-dark) hover:brightness-110",
        outline: "border-2 border-(--color-border) bg-transparent text-(--color-foreground) hover:bg-(--color-card) shadow-neo-card",
        ghost: "hover:bg-(--color-border) hover:text-(--color-foreground)",
        link: "text-(--color-primary) underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-6 py-3 text-sm",
        sm: "h-10 rounded-lg px-4 text-xs",
        lg: "h-16 rounded-2xl px-10 text-base",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
