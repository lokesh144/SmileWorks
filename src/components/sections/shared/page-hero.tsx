import type { CSSProperties, ReactNode } from "react";
import { BrandMotif } from "@/components/sections/shared/brand-motif";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HighlightedText } from "@/components/ui/highlighted-text";
import { cn } from "@/lib/utils";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Dark editorial hero used by inner pages. The entrance animation is
 * CSS-only so the heading paints immediately (good for LCP) and still
 * respects prefers-reduced-motion.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  aside,
  className,
}: {
  eyebrow: string;
  /** Supports [bracketed] highlight syntax. */
  title: string;
  lead: string;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-dark relative isolate overflow-hidden", className)}>
      <HeroBackdrop />
      <div className="container-site relative grid gap-12 pt-[calc(var(--header-height)+4rem)] pb-20 md:pt-[calc(var(--header-height)+5.5rem)] md:pb-28 lg:grid-cols-12 lg:items-end">
        <div className={cn(aside ? "lg:col-span-7" : "lg:col-span-10")}>
          <div className="hero-rise" style={delay(0)}>
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          </div>
          <h1 className="type-h1 hero-rise mt-6 text-white" style={delay(90)}>
            <HighlightedText text={title} tone="dark" />
          </h1>
          <p className="type-lead hero-rise mt-6 max-w-2xl text-copy-on-dark" style={delay(180)}>
            {lead}
          </p>
          {children && (
            <div className="hero-rise mt-9 flex flex-wrap gap-3" style={delay(270)}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="hero-rise lg:col-span-5" style={delay(320)}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="bg-grid-dark absolute inset-0" />
      <div className="absolute -top-1/3 -right-1/4 size-[720px] rounded-full bg-[radial-gradient(closest-side,rgb(255_198_41/0.20),transparent)] lg:motion-safe:animate-drift" />
      <div className="absolute -bottom-1/2 -left-1/4 size-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.06),transparent)]" />
      <BrandMotif className="absolute top-1/2 -right-40 hidden w-[620px] -translate-y-1/3 text-white lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
