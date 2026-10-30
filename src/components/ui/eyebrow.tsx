import { cn } from "@/lib/utils";

/** Small uppercase label. On light surfaces the text stays charcoal — gold is used only for the dot. */
export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "type-eyebrow inline-flex items-center gap-2.5",
        tone === "dark" ? "text-gold" : "text-ink",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-gold shadow-[0_0_0_4px_rgb(255_198_41/0.22)]" />
      {children}
    </p>
  );
}
