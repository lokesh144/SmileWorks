import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/animations/magnetic";
import { Reveal } from "@/components/animations/reveal";
import { BrandMotif } from "@/components/sections/shared/brand-motif";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HighlightedText } from "@/components/ui/highlighted-text";
import { ctas } from "@/config/navigation";

type Action = { label: string; href: string };

/** Dark closing call-to-action band used at the end of every page. */
export function CtaSection({
  eyebrow = "Let's talk",
  title = "Let's Make Your Practice Run [Smarter].",
  lead = "Book a free consultation. Tell us where your team needs support and we'll recommend a practical way forward.",
  primary = ctas.consultation,
  secondary,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  primary?: Action;
  secondary?: Action;
}) {
  return (
    <section aria-labelledby="cta-heading" className="bg-paper px-3 py-3 sm:px-4 sm:py-4">
      <div className="surface-dark relative isolate overflow-hidden rounded-[28px] md:rounded-[36px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid-dark absolute inset-0 opacity-70" />
          <div className="absolute -bottom-1/2 left-1/2 size-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_198_41/0.22),transparent)]" />
          <BrandMotif className="absolute -top-24 -left-24 hidden w-[420px] text-white md:block" />
        </div>
        <Reveal className="container-site flex flex-col items-center py-20 text-center md:py-28">
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          <h2 id="cta-heading" className="type-h2 mt-6 max-w-3xl text-white">
            <HighlightedText text={title} tone="dark" />
          </h2>
          <p className="type-lead mt-5 max-w-2xl text-copy-on-dark">{lead}</p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Magnetic>
              <Button asChild size="lg">
                <Link href={primary.href}>
                  {primary.label}
                  <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
                </Link>
              </Button>
            </Magnetic>
            {secondary && (
              <Button asChild size="lg" variant="outline-light">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
