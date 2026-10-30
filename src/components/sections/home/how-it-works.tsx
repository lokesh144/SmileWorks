import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProcessTimeline } from "@/components/animations/process-timeline";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/shared/section-heading";
import { Button } from "@/components/ui/button";
import { ctas } from "@/config/navigation";
import { howItWorks } from "@/data/home";

export function HowItWorks() {
  return (
    <Section tone="dark" aria-labelledby="how-heading" className="overflow-hidden">
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-site relative">
        <SectionHeading
          id="how-heading"
          tone="dark"
          align="center"
          eyebrow="How it works"
          title="Getting started is [simple]."
          lead="Three clear steps from first conversation to a support team that works the way your practice does."
        />
        <ProcessTimeline steps={howItWorks} tone="dark" className="mt-16 md:mt-20" />
        <div className="mt-16 flex justify-center">
          <Button asChild variant="outline-light">
            <Link href={ctas.pricing.href}>
              {ctas.pricing.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
