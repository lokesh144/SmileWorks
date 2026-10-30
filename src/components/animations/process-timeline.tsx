"use client";

import { m, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { duration, easing, revealViewport } from "@/lib/motion";

type Step = { title: string; text: string };

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing.outExpo } },
};

const lineVariants = (axis: "x" | "y"): Variants => ({
  hidden: axis === "x" ? { scaleX: 0 } : { scaleY: 0 },
  visible: {
    ...(axis === "x" ? { scaleX: 1 } : { scaleY: 1 }),
    transition: { duration: 1.4, ease: easing.soft },
  },
});

/**
 * Ordered process steps with a progress line that draws in on scroll.
 * Semantics come from the <ol>; animation is purely decorative.
 */
export function ProcessTimeline({
  steps,
  orientation = "horizontal",
  tone = "light",
  className,
}: {
  steps: ReadonlyArray<Step>;
  orientation?: "horizontal" | "vertical";
  tone?: "light" | "dark";
  className?: string;
}) {
  const horizontal = orientation === "horizontal";
  const dark = tone === "dark";

  return (
    <m.div
      className={cn("relative", className)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={listVariants}
    >
      {/* Connector track + animated fill */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute",
          horizontal
            ? "top-7 right-[16%] left-[16%] hidden h-px md:block"
            : "top-7 bottom-7 left-7 w-px",
          dark ? "bg-white/12" : "bg-line",
        )}
      >
        <m.div
          data-reveal=""
          variants={lineVariants(horizontal ? "x" : "y")}
          className={cn("h-full w-full bg-gold", horizontal ? "origin-left" : "origin-top")}
        />
      </div>

      <ol className={cn("relative grid gap-10", horizontal ? "md:grid-cols-3 md:gap-8" : "gap-8")}>
        {steps.map((step, index) => (
          <m.li
            key={step.title}
            data-reveal=""
            variants={stepVariants}
            className={cn(horizontal ? "flex gap-5 md:flex-col md:items-center md:text-center" : "flex gap-6")}
          >
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 grid size-14 shrink-0 place-items-center rounded-full border font-display text-lg font-extrabold",
                dark ? "border-white/15 bg-ink text-gold" : "border-line bg-white text-ink shadow-(--shadow-card)",
              )}
            >
              <span className="absolute inset-1.5 rounded-full bg-gold/15" />
              <span className="relative">{String(index + 1).padStart(2, "0")}</span>
            </span>
            <div className={cn(horizontal ? "pt-2 md:max-w-xs md:pt-4" : "pt-2.5")}>
              <h3 className={cn("type-h3", dark ? "text-white" : "text-ink")}>
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className={cn("mt-2 leading-relaxed", dark ? "text-copy-on-dark" : "text-copy")}>{step.text}</p>
            </div>
          </m.li>
        ))}
      </ol>
    </m.div>
  );
}
