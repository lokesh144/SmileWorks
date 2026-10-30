import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/animations/magnetic";
import { HeroVisual } from "@/components/sections/home/hero-visual";
import { HeroBackdrop } from "@/components/sections/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HighlightedText } from "@/components/ui/highlighted-text";
import { ctas } from "@/config/navigation";
import { hero } from "@/data/home";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function HomeHero() {
  return (
    <section aria-labelledby="hero-heading" className="surface-dark relative isolate overflow-hidden min-h-screen">
        {/* Background image */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-[0.14]"
    style={{
      backgroundImage: "url('/Consultant.jpg')",
    }}
  />
      {/* <HeroBackdrop /> */}
      <div className="container-site relative grid items-center gap-14 pt-[calc(var(--header-height)+3.5rem)] pb-20 md:pt-[calc(var(--header-height)+5rem)] md:pb-28 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="hero-rise" style={delay(0)}>
            <Eyebrow tone="dark">{hero.eyebrow}</Eyebrow>
          </div>
          <h1 id="hero-heading" className="type-display hero-rise mt-7 text-white" style={delay(100)}>
            <HighlightedText text={hero.heading} tone="dark" />
          </h1>
          <p className="type-lead hero-rise mt-7 max-w-xl text-copy-on-dark" style={delay(200)}>
            {hero.lead}
          </p>
          <div className="hero-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={delay(300)}>
            <Magnetic>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={ctas.consultation.href}>
                  {ctas.consultation.label}
                  <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="outline-light">
              <Link href={ctas.services.href}>{ctas.services.label}</Link>
            </Button>
          </div>
        </div>
        <div className="hero-rise lg:col-span-5" style={delay(380)}>
          {/* <HeroVisual /> */}
        </div>
      </div>
    </section>
  );
}
