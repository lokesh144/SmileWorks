import { StaggerGroup, StaggerItem } from "@/components/animations/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/shared/section-heading";
import { IconBadge } from "@/components/ui/icon-badge";
import { outcomes } from "@/data/home";

export function Outcomes() {
  return (
    <Section tone="white" aria-labelledby="outcomes-heading">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="outcomes-heading" eyebrow={outcomes.eyebrow} title={outcomes.heading} lead={outcomes.lead} />
          <p className="mt-8 border-l-2 border-gold pl-4 text-sm leading-relaxed text-copy">{outcomes.disclaimer}</p>
        </div>
        <StaggerGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {outcomes.items.map((item, index) => (
            <StaggerItem as="li" key={item.title} className="h-full">
              <div className="group card-lift relative h-full overflow-hidden rounded-3xl border border-line bg-paper p-7 md:p-8">
                <span
                  aria-hidden="true"
                  className="absolute -top-6 -right-2 font-display text-[7rem] leading-none font-extrabold text-ink/[0.04]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <IconBadge icon={item.icon} />
                <h3 className="type-h3 mt-6 text-ink">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-copy">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
