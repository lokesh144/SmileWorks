import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { fieldControlClass } from "@/components/ui/input"

/** Styled native <select>: fully accessible and works well on mobile. */
function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(fieldControlClass, "h-12 cursor-pointer appearance-none pr-11", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-copy" />
    </div>
  )
}

export { NativeSelect }
