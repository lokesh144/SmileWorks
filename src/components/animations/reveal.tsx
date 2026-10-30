"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { distance, duration, easing, revealViewport } from "@/lib/motion";

type RevealTag = "div" | "section" | "li" | "article" | "header";

const components = { div: m.div, section: m.section, li: m.li, article: m.article, header: m.header };

type RevealProps = {
  as?: RevealTag;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
  id?: string;
};

/**
 * Fades and lifts content into view once. `data-reveal` lets the <noscript>
 * fallback in the root layout keep content visible without JavaScript.
 */
export function Reveal({ as = "div", delay = 0, y = distance.reveal, className, children, id }: RevealProps) {
  const Component = components[as];
  return (
    <Component
      id={id}
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: duration.slow, ease: easing.outExpo, delay }}
    >
      {children}
    </Component>
  );
}

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: distance.reveal },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing.outExpo } },
};

type StaggerProps = { as?: "div" | "ul" | "ol"; className?: string; children: ReactNode };

const groupComponents = { div: m.div, ul: m.ul, ol: m.ol };

export function StaggerGroup({ as = "div", className, children }: StaggerProps) {
  const Component = groupComponents[as];
  return (
    <Component className={className} initial="hidden" whileInView="visible" viewport={revealViewport} variants={groupVariants}>
      {children}
    </Component>
  );
}

export function StaggerItem({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "li" | "article";
  className?: string;
  children: ReactNode;
}) {
  const Component = components[as];
  return (
    <Component data-reveal="" className={className} variants={itemVariants}>
      {children}
    </Component>
  );
}
