import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders text where [bracketed] words are highlighted. Use gold only on
 * dark surfaces or at large display sizes; on light surfaces the highlight
 * becomes a gold underline so text contrast is preserved.
 */
export function HighlightedText({ text, tone = "dark" }: { text: string; tone?: "light" | "dark" }) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) => {
        const match = /^\[(.+)\]$/.exec(part);
        if (!match) return <Fragment key={index}>{part}</Fragment>;
        return (
          <span
            key={index}
            className={cn(
              tone === "dark"
                ? "text-gold"
                : "bg-[linear-gradient(transparent_62%,rgb(255_198_41/0.75)_62%,rgb(255_198_41/0.75)_92%,transparent_92%)] px-0.5",
            )}
          >
            {match[1]}
          </span>
        );
      })}
    </>
  );
}
