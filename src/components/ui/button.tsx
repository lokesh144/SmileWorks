import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-full font-display font-bold tracking-[-0.01em] whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-(--ease-soft) active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-gold text-ink shadow-[0_1px_0_rgb(255_255_255/0.4)_inset] hover:bg-gold-soft hover:shadow-glow",
        dark: "bg-ink text-white hover:bg-graphite",
        outline: "border border-ink/15 bg-white text-ink hover:border-ink/60",
        "outline-light": "border border-white/25 text-white hover:border-white/60 hover:bg-white/[0.06]",
        ghost: "text-ink hover:bg-ink/5",
        link: "h-auto rounded-sm px-0 text-ink underline decoration-gold decoration-2 underline-offset-4 hover:decoration-ink",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        default: "h-12 px-6 text-[0.9375rem]",
        lg: "h-14 px-7 text-base",
        icon: "size-11",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
