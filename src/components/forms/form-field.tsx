import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function fieldIds(name: string) {
  return { input: `field-${name}`, error: `field-${name}-error`, hint: `field-${name}-hint` };
}

/** Accessible label + hint + error wrapper. The control must use the ids from `fieldIds`. */
export function FormField({
  name,
  label,
  required = false,
  hint,
  error,
  className,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  const ids = fieldIds(name);
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={ids.input}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-copy">(optional)</span>
        )}
      </Label>
      {children}
      {hint && !error && (
        <p id={ids.hint} className="text-sm text-copy">
          {hint}
        </p>
      )}
      {error && (
        <p id={ids.error} className="flex items-start gap-1.5 text-sm font-medium text-destructive">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props wiring a control to its hint and error message. */
export function describedBy(name: string, { hasHint = false, error }: { hasHint?: boolean; error?: string }) {
  const ids = fieldIds(name);
  const describedByIds = [error ? ids.error : null, hasHint && !error ? ids.hint : null].filter(Boolean).join(" ");
  return {
    id: ids.input,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedByIds || undefined,
  };
}
