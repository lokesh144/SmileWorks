import Link from "next/link";
import { headers } from "next/headers";
import { ArrowRight, Info } from "lucide-react";
import { Magnetic } from "@/components/animations/magnetic";
import { ServiceDetail } from "@/components/sections/services/service-detail";
import { ServiceNav } from "@/components/sections/services/service-nav";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FaqSection } from "@/components/sections/shared/faq-section";
import { JsonLd } from "@/components/sections/shared/json-ld";
import { PageHero } from "@/components/sections/shared/page-hero";
import { Button } from "@/components/ui/button";
import { ctas } from "@/config/navigation";
import { servicesFaqs } from "@/data/faqs";
import { serviceScopeNote, services } from "@/data/services";
import { buildMetadata, servicesJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Dental Virtual Staffing Services",
  description:
    "Remote front desk, appointment scheduling, patient recall, dental billing and insurance coordination, administrative and payroll assistance, and marketing & IT support for dental practices.",
  path: "/services",
});

export default async function ServicesPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="The Right Support for Every Part of Your [Practice]."
        lead="From the first phone call to the final statement, our remote professionals help your team keep daily operations organized — so your practice can focus on patients."
      >
        <Magnetic>
          <Button asChild size="lg">
            <Link href={ctas.consultation.href}>
              {ctas.consultation.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Magnetic>
        <Button asChild size="lg" variant="outline-light">
          <Link href={ctas.pricing.href}>{ctas.pricing.label}</Link>
        </Button>
      </PageHero>

      <ServiceNav />

      <div className="bg-white">
        <div className="container-site pt-12">
          <p className="flex max-w-3xl gap-3 rounded-2xl border border-gold/50 bg-gold/10 p-5 text-sm leading-relaxed text-ink">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {serviceScopeNote}
          </p>
        </div>
      </div>

      {services.map((service, index) => (
        <ServiceDetail key={service.id} service={service} index={index} />
      ))}

      <FaqSection faqs={servicesFaqs} title="Questions about our services" lead="Straight answers about how remote support works with your practice." />

      <CtaSection
        title="Not sure where to [start]?"
        lead="Tell us what's taking up your team's time. We'll help you identify which support would make the biggest difference."
        secondary={ctas.pricing}
      />

      <JsonLd data={servicesJsonLd(services)} nonce={nonce} />
    </>
  );
}
