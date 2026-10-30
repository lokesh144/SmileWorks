import { HomeHero } from "@/components/sections/home/home-hero";
import { HowItWorks } from "@/components/sections/home/how-it-works";
import { Outcomes } from "@/components/sections/home/outcomes";
import { ServicesGrid } from "@/components/sections/home/services-grid";
import { SocialProof } from "@/components/sections/home/testimonials";
import { ValueStrip } from "@/components/sections/home/value-strip";
import { WhySmileWorks } from "@/components/sections/home/why-smileworks";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { testimonials } from "@/data/testimonials";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "SmileWorks Solutions | Dental Virtual Staffing & Practice Support",
  description:
    "Dedicated remote professionals for dental practices — virtual front desk, scheduling, patient recall, billing and insurance coordination, admin and marketing support. Book a free consultation.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ValueStrip />
      <ServicesGrid />
      <WhySmileWorks />
      <HowItWorks />
      <Outcomes />
      <SocialProof testimonials={testimonials} />
      <CtaSection />
    </>
  );
}
