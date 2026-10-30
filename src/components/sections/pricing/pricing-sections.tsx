import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { ProcessTimeline } from "@/components/animations/process-timeline";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/shared/section-heading";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";
import { ctas } from "@/config/navigation";
import {
  comparisonRows,
  engagementDisclaimer,
  engagements,
  onboardingSteps,
  pricingFactors,
  type Engagement,
} from "@/data/pricing";
import { cn } from "@/lib/utils";

const quoteHref = (engagement: Engagement) => `${ctas.quote.href}?team=${engagement.teamSize}`;

export function PricingFactors() {
  return (
    <Section tone="white" aria-labelledby="factors-heading">
      <div className="container-site">
        <SectionHeading
          id="factors-heading"
          eyebrow="What shapes your quote"
          title="Pricing that reflects [your practice]."
          lead="We don't believe in one-size-fits-all packages. Your quote is based on the support you actually need."
        />
        <StaggerGroup as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pricingFactors.map((factor) => (
            <StaggerItem as="li" key={factor.title} className="h-full">
              <div className="group card-lift flex h-full gap-5 rounded-3xl border border-line bg-white p-7">
                <IconBadge icon={factor.icon} />
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{factor.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-copy">{factor.text}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}

export function EngagementOptions() {
  return (
    <Section tone="paper" id="engagements" aria-labelledby="engagements-heading">
      <div className="container-site">
        <SectionHeading
          id="engagements-heading"
          eyebrow="Ways to work together"
          title="Three flexible engagement options."
          lead="Use these as a starting point for the conversation. We'll recommend the best fit during your consultation."
          align="center"
        />
        <StaggerGroup as="ul" className="mt-14 grid gap-5 lg:grid-cols-3">
          {engagements.map((engagement) => (
            <StaggerItem as="li" key={engagement.id} className="h-full">
              <article
                aria-labelledby={`${engagement.id}-title`}
                className={cn(
                  "card-lift relative flex h-full flex-col rounded-[28px] border p-8 md:p-9",
                  engagement.featured ? "surface-dark border-ink" : "border-line bg-white",
                )}
              >
                {engagement.featured && (
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_80%_0%,rgb(255_198_41/0.22),transparent_55%)]" />
                )}
                <p
                  className={cn(
                    "type-eyebrow relative inline-flex self-start rounded-full border px-3 py-1.5 text-[0.65rem]",
                    engagement.featured ? "border-gold/40 text-gold" : "border-line text-ink",
                  )}
                >
                  Engagement option
                </p>
                <h3 id={`${engagement.id}-title`} className={cn("type-h3 relative mt-6", engagement.featured ? "text-white" : "text-ink")}>
                  {engagement.title}
                </h3>
                <p className={cn("relative mt-3 leading-relaxed", engagement.featured ? "text-copy-on-dark" : "text-copy")}>
                  {engagement.summary}
                </p>
                <p className={cn("relative mt-6 border-t pt-6 text-sm leading-relaxed", engagement.featured ? "border-white/10 text-white/85" : "border-line text-ink/85")}>
                  <span className="font-bold">Best for: </span>
                  {engagement.bestFor}
                </p>
                <h4 className={cn("relative mt-6 text-sm font-bold", engagement.featured ? "text-white" : "text-ink")}>
                  May include <span className="font-normal opacity-75">(subject to agreement)</span>
                </h4>
                <ul className="relative mt-4 flex-1 space-y-3">
                  {engagement.possibleInclusions.map((item) => (
                    <li key={item} className={cn("flex gap-3 text-[0.9375rem]", engagement.featured ? "text-copy-on-dark" : "text-copy")}>
                      <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold text-ink">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={engagement.featured ? "primary" : "dark"} className="relative mt-8 w-full">
                  <Link href={quoteHref(engagement)}>
                    {ctas.quote.label}
                    <span className="sr-only"> for {engagement.title}</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <p className="mx-auto mt-10 flex max-w-2xl justify-center gap-3 text-center text-sm leading-relaxed text-copy">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink" />
          {engagementDisclaimer}
        </p>
      </div>
    </Section>
  );
}

export function ComparisonTable() {
  return (
    <Section tone="white" aria-labelledby="compare-heading">
      <div className="container-site">
        <SectionHeading
          id="compare-heading"
          eyebrow="Compare"
          title="Compare engagement styles."
          lead="A general guide to how each option typically works. Final inclusions are always subject to agreement."
        />

        {/* Desktop / tablet: semantic table */}
        <Reveal className="mt-12 hidden overflow-hidden rounded-3xl border border-line md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Comparison of SmileWorks engagement options. All inclusions are subject to agreement.</caption>
            <thead>
              <tr className="bg-ink text-white">
                <th scope="col" className="w-1/4 p-5 font-display text-sm font-bold lg:p-6">
                  <span className="sr-only">Feature</span>
                </th>
                {engagements.map((engagement) => (
                  <th key={engagement.id} scope="col" className="p-5 font-display text-base font-bold lg:p-6">
                    {engagement.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr key={row.label} className={index % 2 === 0 ? "bg-white" : "bg-paper"}>
                  <th scope="row" className="p-5 font-display text-sm font-bold text-ink lg:p-6">
                    {row.label}
                  </th>
                  {row.values.map((value, valueIndex) => (
                    <td key={valueIndex} className="p-5 text-[0.9375rem] leading-relaxed text-copy lg:p-6">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* Mobile: stacked cards (no horizontal scrolling) */}
        <ul className="mt-10 space-y-4 md:hidden">
          {engagements.map((engagement, column) => (
            <li key={engagement.id} className="rounded-3xl border border-line bg-white p-6">
              <h3 className="type-h3 text-ink">{engagement.title}</h3>
              <dl className="mt-4 divide-y divide-line">
                {comparisonRows.map((row) => (
                  <div key={row.label} className="grid gap-1 py-3">
                    <dt className="text-xs font-bold tracking-wide text-ink uppercase">{row.label}</dt>
                    <dd className="text-[0.9375rem] text-copy">{row.values[column]}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-copy">* All inclusions are indicative and subject to a written agreement.</p>
      </div>
    </Section>
  );
}

export function OnboardingTimeline() {
  return (
    <Section tone="stone" aria-labelledby="onboarding-heading">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="onboarding-heading"
              eyebrow="Our process"
              title="From first call to [confident support]."
              lead="A structured onboarding process helps your support professional understand your practice before they start."
            />
            <Button asChild variant="dark" className="mt-8">
              <Link href={ctas.consultation.href}>
                Start with a free consultation
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
        <ProcessTimeline steps={onboardingSteps} orientation="vertical" className="lg:col-span-7" />
      </div>
    </Section>
  );
}
