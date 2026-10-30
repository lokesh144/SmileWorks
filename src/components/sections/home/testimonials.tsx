import { Quote } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/animations/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/shared/section-heading";
import { IconBadge } from "@/components/ui/icon-badge";
import { differentiators } from "@/data/home";
import type { Testimonial } from "@/data/testimonials";

/**
 * Shows verified testimonials when supplied; otherwise falls back to a
 * differentiator section so no client feedback is ever fabricated.
 */
export function SocialProof({ testimonials }: { testimonials: ReadonlyArray<Testimonial> }) {
  const verified = testimonials.filter((item) => item.verified);
  return verified.length > 0 ? <Testimonials items={verified} /> : <Differentiators />;
}

function Testimonials({ items }: { items: ReadonlyArray<Testimonial> }) {
  return (
    <Section tone="paper" aria-labelledby="testimonials-heading">
      <div className="container-site">
        <SectionHeading id="testimonials-heading" eyebrow="Client feedback" title="What practices say about working with us." align="center" />
        <StaggerGroup as="ul" className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <StaggerItem as="li" key={`${item.name}-${item.organization}`} className="h-full">
              <figure className="card-lift flex h-full flex-col rounded-3xl border border-line bg-white p-8">
                <Quote aria-hidden="true" className="size-8 text-gold" />
                <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-ink">“{item.quote}”</blockquote>
                <figcaption className="mt-6 border-t border-line pt-5">
                  <p className="font-display font-bold text-ink">{item.name}</p>
                  <p className="text-sm text-copy">
                    {item.role}, {item.organization}
                  </p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}

function Differentiators() {
  return (
    <Section tone="paper" aria-labelledby="expect-heading">
      <div className="container-site">
        <SectionHeading id="expect-heading" eyebrow={differentiators.eyebrow} title={differentiators.heading} align="center" />
        <StaggerGroup as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.items.map((item) => (
            <StaggerItem as="li" key={item.title} className="h-full">
              <div className="group card-lift h-full rounded-3xl border border-line bg-white p-7">
                <IconBadge icon={item.icon} />
                <h3 className="mt-6 font-display text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-copy">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
