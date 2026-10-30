import * as React from "react"
import { cn } from "@/lib/utils"

export const fieldControlClass =
  "w-full min-w-0 rounded-xl border border-input bg-white px-4 text-base text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-copy/70 hover:border-ink/40 focus-visible:border-ink focus-visible:shadow-[0_0_0_4px_rgb(255_198_41/0.45)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:shadow-[0_0_0_4px_rgb(180_35_24/0.18)]"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldControlClass, "h-12", className)}
      {...props}
    />
  )
}

export { Input }
