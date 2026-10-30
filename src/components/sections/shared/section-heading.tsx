import { Eyebrow } from "@/components/ui/eyebrow";
import { HighlightedText } from "@/components/ui/highlighted-text";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  id,
  className,
}: {
  eyebrow?: string;
  /** Supports [bracketed] highlight syntax. */
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2 id={id} className={cn("type-h2 mt-5", tone === "dark" ? "text-white" : "text-ink")}>
        <HighlightedText text={title} tone={tone} />
      </h2>
      {lead && (
        <p className={cn("type-lead mt-5", tone === "dark" ? "text-copy-on-dark" : "text-copy", align === "center" && "mx-auto")}>
          {lead}
        </p>
      )}
    </div>
  );
}
