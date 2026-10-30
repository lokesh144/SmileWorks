import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/animations/magnetic";
import {
  Audiences,
  BrandStory,
  Leadership,
  MarkMeaning,
  MarkShowcase,
  MissionVision,
  Philosophy,
  Values,
} from "@/components/sections/about/about-sections";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { PageHero } from "@/components/sections/shared/page-hero";
import { Button } from "@/components/ui/button";
import { ctas } from "@/config/navigation";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "SmileWorks Solutions connects dental practices with dedicated remote support professionals. Learn about our mission, values and people-first way of working.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About SmileWorks"
        title="Behind Every Great Practice Is a Great [Support Team]."
        lead="We help dental practices run smoothly by providing dependable remote professionals who care about your patients, your team and your goals."
        aside={<MarkShowcase />}
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
          <Link href={ctas.services.href}>{ctas.services.label}</Link>
        </Button>
      </PageHero>
      <BrandStory />
      <MissionVision />
      <MarkMeaning />
      <Values />
      <Audiences />
      <Philosophy />
      <Leadership />
      <CtaSection
        eyebrow="Work with us"
        title="Let's build a [stronger practice] together."
        lead="Start with a free consultation. We'll listen first, then recommend support that fits your team."
        secondary={ctas.services}
      />
    </>
  );
}
