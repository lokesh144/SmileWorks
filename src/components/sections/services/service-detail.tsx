import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

export function ServiceDetail({ service, index }: { service: Service; index: number }) {
  const headingId = `${service.id}-heading`;
  const alt = index % 2 === 1;

  return (
    <section
      id={service.id}
      aria-labelledby={headingId}
      className={cn("section-y relative border-b border-line lg:scroll-mt-32", alt ? "bg-paper" : "bg-white")}
    >
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="group lg:sticky lg:top-40">
            <div className="flex items-center gap-4">
              <IconBadge icon={service.icon} size="lg" tone="gold" />
              <span className="font-display text-sm font-extrabold tracking-[0.2em] text-ink/45">
                {String(index + 1).padStart(2, "0")} / SERVICE
              </span>
            </div>
            <h2 id={headingId} className="type-h2 mt-7 text-ink">
              {service.title}
            </h2>
            <p className="type-lead mt-5 text-copy">{service.description}</p>
            {service.boundary && (
              <p className="mt-6 flex gap-3 rounded-2xl border border-line bg-stone/70 p-4 text-sm leading-relaxed text-copy">
                <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink" />
                {service.boundary}
              </p>
            )}
            <Button asChild variant="dark" className="mt-8">
              <Link href={`/contact?service=${service.id}`}>
                Discuss this service
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:col-span-7">
          <Reveal className="rounded-3xl border border-line bg-white p-7 md:p-9">
            <h3 className="type-h3 text-ink">What this role can help with</h3>
            <ul className="mt-6 grid gap-3.5">
              {service.tasks.map((task) => (
                <li key={task} className="flex gap-3 leading-relaxed text-ink/85">
                  <span aria-hidden="true" className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-gold text-ink">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {task}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="surface-dark rounded-3xl p-7 md:p-9" delay={0.05}>
            <h3 className="type-h3 text-white">A good fit for</h3>
            <ul className="mt-6 grid gap-3">
              {service.idealFor.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-copy-on-dark">
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <div>
            <h3 className="sr-only">Practical benefits</h3>
            <StaggerGroup as="ul" className="grid gap-5 sm:grid-cols-3">
              {service.benefits.map((benefit) => (
                <StaggerItem as="li" key={benefit.title} className="h-full">
                  <div className="card-lift h-full rounded-3xl border border-line bg-white p-6">
                    <span aria-hidden="true" className="block h-1 w-8 rounded-full bg-gold" />
                    <p className="mt-5 font-display font-bold text-ink">{benefit.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-copy">{benefit.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
