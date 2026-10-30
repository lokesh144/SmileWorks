import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Headset } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/shared/section-heading";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";
import { brand } from "@/config/brand";
import { ctas } from "@/config/navigation";
import { whySmileWorks } from "@/data/home";

export function WhySmileWorks() {
  return (
    <Section tone="paper" aria-labelledby="why-heading">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="why-heading" eyebrow={whySmileWorks.eyebrow} title={whySmileWorks.heading} lead={whySmileWorks.lead} />
            <Reveal delay={0.1} className="mt-10">
              <PartnershipCard />
            </Reveal>
            <Button asChild variant="dark" className="mt-8">
              <Link href={ctas.about.href}>
                {ctas.about.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <StaggerGroup as="ul" className="lg:col-span-7">
          {whySmileWorks.points.map((point) => (
            <StaggerItem
              as="li"
              key={point.title}
              className="group flex gap-6 border-b border-line py-8 first:pt-0 last:border-b-0 md:gap-8 md:py-10"
            >
              <IconBadge icon={point.icon} size="lg" />
              <div>
                <h3 className="type-h3 text-ink">{point.title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-copy">{point.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}

function PartnershipCard() {
  return (
    <div
      role="img"
      aria-label="Diagram: your in-office team and your SmileWorks support professionals working together"
      className="surface-dark relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div aria-hidden="true" className="bg-grid-dark absolute inset-0 opacity-60" />
      <div className="relative flex items-center justify-between gap-3">
        <PartnerNode icon={Building2} label="Your in-office team" />
        <div className="relative flex flex-1 items-center justify-center">
          <span className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-white/10 via-gold to-white/10" />
          <span className="relative grid size-16 place-items-center rounded-2xl border border-white/10 bg-ink sm:size-20">
            <Image src={brand.assets.markOnDark} alt="" width={295} height={201} className="w-10 sm:w-12" />
          </span>
        </div>
        <PartnerNode icon={Headset} label="Your SmileWorks support" />
      </div>
    </div>
  );
}

function PartnerNode({ icon: Icon, label }: { icon: typeof Building2; label: string }) {
  return (
    <div className="flex w-24 flex-col items-center gap-3 text-center sm:w-28">
      <span className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-gold">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <span className="text-xs leading-snug font-semibold text-white/85">{label}</span>
    </div>
  );
}
