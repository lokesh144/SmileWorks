import { StaggerGroup, StaggerItem } from "@/components/animations/reveal";
import { IconBadge } from "@/components/ui/icon-badge";
import { valueProps } from "@/data/home";

export function ValueStrip() {
  return (
    <section aria-labelledby="values-heading" className="border-b border-line bg-paper">
      <div className="container-site py-12 md:py-14">
        <h2 id="values-heading" className="sr-only">
          What SmileWorks offers
        </h2>
        <StaggerGroup as="ul" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {valueProps.map((item) => (
            <StaggerItem as="li" key={item.title} className="group flex gap-4 lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <IconBadge icon={item.icon} size="sm" />
              <div>
                <h3 className="font-display text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-copy">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
