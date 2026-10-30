import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Rounded icon tile. Animates (lift + tilt) when inside a `.group` that is hovered or focused. */
export function IconBadge({
  icon: Icon,
  tone = "light",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: "light" | "dark" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "icon-pop inline-grid shrink-0 place-items-center border",
        size === "sm" && "size-10 rounded-xl [&_svg]:size-[18px]",
        size === "md" && "size-12 rounded-2xl [&_svg]:size-5",
        size === "lg" && "size-14 rounded-2xl [&_svg]:size-6",
        tone === "light" && "border-gold/40 bg-gold/15 text-ink group-hover:bg-gold",
        tone === "dark" && "border-white/10 bg-white/[0.06] text-gold group-hover:bg-gold group-hover:text-ink",
        tone === "gold" && "border-gold bg-gold text-ink",
        className,
      )}
    >
      <Icon strokeWidth={1.75} />
    </span>
  );
}
