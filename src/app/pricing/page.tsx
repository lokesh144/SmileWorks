import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/animations/magnetic";
import {
  ComparisonTable,
  EngagementOptions,
  OnboardingTimeline,
  PricingFactors,
} from "@/components/sections/pricing/pricing-sections";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FaqSection } from "@/components/sections/shared/faq-section";
import { PageHero } from "@/components/sections/shared/page-hero";
import { Button } from "@/components/ui/button";
import { ctas } from "@/config/navigation";
import { pricingFaqs } from "@/data/faqs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing & Process",
  description:
    "Flexible dental virtual staffing engagements — focused support, a dedicated team member or a custom team. Learn what shapes your quote and how onboarding works.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing & process"
        title="Flexible Support. Clear Conversations. Better [Value]."
        lead="Every practice is different, so every quote is tailored. Tell us what you need and we'll recommend the right engagement — with clear terms before anything begins."
      >
        <Magnetic>
          <Button asChild size="lg">
            <Link href={ctas.quote.href}>
              {ctas.quote.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Magnetic>
        <Button asChild size="lg" variant="outline-light">
          <a href="#engagements">View engagement options</a>
        </Button>
      </PageHero>
      <PricingFactors />
      <EngagementOptions />
      <ComparisonTable />
      <OnboardingTimeline />
      <FaqSection faqs={pricingFaqs} title="Pricing questions" lead="What to expect when you request a quote." />
      <CtaSection
        eyebrow="Get a tailored quote"
        title="Let's find the right fit for [your practice]."
        lead="Share a few details about your practice and the support you're considering. We'll follow up to arrange your free consultation."
        primary={ctas.quote}
        secondary={ctas.services}
      />
    </>
  );
}
