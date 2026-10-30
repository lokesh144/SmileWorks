import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/animations/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/shared/section-heading";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";
import { ctas } from "@/config/navigation";
import { services } from "@/data/services";

export function ServicesGrid() {
  return (
    <Section tone="white" aria-labelledby="services-heading">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="services-heading"
            eyebrow="Core services"
            title="Support for every part of your [front office] and beyond."
            lead="Choose focused help in one area or combine services into a team that fits the way your practice works."
          />
          <Button asChild variant="outline" className="self-start lg:self-auto">
            <Link href={ctas.services.href}>
              View all services
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <StaggerGroup as="ul" className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem as="li" key={service.id} className="h-full">
              <article className="group card-lift relative flex h-full flex-col rounded-3xl border border-line bg-white p-7 hover:border-ink/20 md:p-8">
                <div className="flex items-start justify-between">
                  <IconBadge icon={service.icon} size="lg" />
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-ink/30 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                  />
                </div>
                <h3 className="type-h3 mt-7 text-ink">{service.cardTitle}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-copy">{service.summary}</p>
                <Link
                  href={`/services#${service.id}`}
                  className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-bold text-ink underline decoration-gold decoration-2 underline-offset-[6px] after:absolute after:inset-0 after:rounded-3xl after:content-['']"
                >
                  Learn more<span className="sr-only"> about {service.cardTitle}</span>
                </Link>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
