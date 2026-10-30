import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/shared/section-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IconBadge } from "@/components/ui/icon-badge";
import { brand } from "@/config/brand";
import {
  audiences,
  brandStory,
  communicationCommitments,
  leadership,
  missionVision,
  philosophy,
  values,
} from "@/data/about";

export function MarkShowcase() {
  return (
    <div className="relative mx-auto max-w-md rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm sm:p-10">
      <div className="relative grid aspect-[4/3] place-items-center">
        <div aria-hidden="true" className="absolute inset-6 rounded-full bg-[radial-gradient(closest-side,rgb(255_198_41/0.25),transparent)]" />
        <Image
          src={brand.assets.markOnDark}
          alt="The SmileWorks Solutions brand mark"
          width={295}
          height={201}
          className="relative w-3/4 lg:motion-safe:animate-float"
          loading="eager"
        />
      </div>
      <p className="mt-6 text-center font-display text-sm font-semibold tracking-wide text-copy-on-dark">
        A person, lifted by a smile.
      </p>
    </div>
  );
}

export function BrandStory() {
  return (
    <Section tone="white" aria-labelledby="story-heading">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading id="story-heading" eyebrow={brandStory.eyebrow} title={brandStory.heading} />
        </div>
        <Reveal className="space-y-6 lg:col-span-7">
          {brandStory.paragraphs.map((paragraph, index) => (
            <p key={index} className={index === 0 ? "type-lead text-ink" : "leading-relaxed text-copy md:text-lg"}>
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

export function MissionVision() {
  return (
    <section aria-label="Mission and vision" className="bg-white pb-[clamp(4.5rem,3rem+6vw,8rem)]">
      <StaggerGroup className="container-site grid gap-5 md:grid-cols-2">
        {missionVision.map((item, index) => (
          <StaggerItem key={item.title} className="h-full">
            <div
              className={
                index === 0
                  ? "surface-dark group h-full rounded-3xl p-8 md:p-12"
                  : "group h-full rounded-3xl border border-gold bg-gold p-8 text-ink md:p-12"
              }
            >
              <IconBadge icon={item.icon} tone={index === 0 ? "dark" : "light"} size="lg" className={index === 1 ? "border-ink/15 bg-white/50" : undefined} />
              <h2 className={`type-h3 mt-8 ${index === 0 ? "text-white" : "text-ink"}`}>{item.title}</h2>
              <p className={`type-lead mt-3 ${index === 0 ? "text-copy-on-dark" : "text-ink/85"}`}>{item.text}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

const symbolism = [
  { title: "The circle", text: "The person at the heart of every practice — patients, clinicians and the team around them." },
  { title: "The golden curve", text: "Positivity and an upward lift: support that helps people and practices rise." },
  { title: "The supporting arc", text: "Steady, dependable help working quietly in the background." },
];

export function MarkMeaning() {
  return (
    <Section tone="paper" aria-labelledby="mark-heading" className="overflow-hidden">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto grid aspect-square max-w-lg place-items-center rounded-[36px] border border-line bg-white shadow-(--shadow-card)">
            <div aria-hidden="true" className="bg-dots-light absolute inset-0 rounded-[36px] opacity-70" />
            <div aria-hidden="true" className="absolute size-3/4 rounded-full border border-dashed border-ink/10" />
            <Image src={brand.assets.markOnLight} alt="SmileWorks Solutions brand mark" width={295} height={201} className="relative w-3/5" />
          </div>
        </Reveal>
        <div>
          <SectionHeading
            id="mark-heading"
            eyebrow="Our symbol"
            title="Human-centered by [design]."
            lead="Our mark reflects what we believe great support should feel like for the people in your practice."
          />
          <StaggerGroup as="ol" className="mt-10 space-y-6">
            {symbolism.map((item, index) => (
              <StaggerItem as="li" key={item.title} className="flex gap-5">
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-sm font-extrabold text-gold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-copy">{item.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </Section>
  );
}

export function Values() {
  return (
    <Section tone="dark" aria-labelledby="values-heading" className="overflow-hidden">
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-site relative">
        <SectionHeading
          id="values-heading"
          tone="dark"
          align="center"
          eyebrow="Our values"
          title="Four ideas that shape [how we work]."
        />
        <StaggerGroup as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <StaggerItem as="li" key={value.title} className="h-full">
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-gold/40 hover:bg-white/[0.06]">
                <IconBadge icon={value.icon} tone="dark" size="lg" />
                <h3 className="type-h3 mt-7 text-white">{value.title}</h3>
                <p className="type-eyebrow mt-2 text-gold">{value.tagline}</p>
                <p className="mt-4 leading-relaxed text-copy-on-dark">{value.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}

export function Audiences() {
  return (
    <Section tone="white" aria-labelledby="serve-heading">
      <div className="container-site">
        <SectionHeading
          id="serve-heading"
          eyebrow="Who we serve"
          title="Built for dental practices at every stage."
          lead="Whether you run a single-chair practice or coordinate several locations, support can be shaped around your team."
        />
        <StaggerGroup as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item) => (
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

export function Philosophy() {
  return (
    <Section tone="stone" aria-labelledby="philosophy-heading">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="philosophy-heading"
            eyebrow="How we work"
            title="A working philosophy built on [clarity]."
            lead="Good support isn't only about completing tasks. It's about being easy to work with, every day."
          />
          <div className="mt-10 rounded-3xl border border-line bg-white p-7">
            <Eyebrow>Our commitment to communication</Eyebrow>
            <ul className="mt-6 space-y-5">
              {communicationCommitments.map((item) => (
                <li key={item.title} className="group flex gap-4">
                  <IconBadge icon={item.icon} size="sm" />
                  <div>
                    <h3 className="font-display font-bold text-ink">{item.title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-copy">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <StaggerGroup as="ol" className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
          {philosophy.map((item, index) => (
            <StaggerItem as="li" key={item.title} className="h-full">
              <div className="card-lift h-full rounded-3xl border border-line bg-white p-7 md:p-8">
                <span aria-hidden="true" className="font-display text-4xl font-extrabold text-ink/10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="type-h3 mt-4 text-ink">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-copy">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}

/** Rendered only when real, approved leadership profiles are supplied in src/data/about.ts. */
export function Leadership() {
  if (leadership.length === 0) return null;
  return (
    <Section tone="white" aria-labelledby="leadership-heading">
      <div className="container-site">
        <SectionHeading id="leadership-heading" eyebrow="Leadership" title="The people behind SmileWorks." />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((person) => (
            <li key={person.name} className="rounded-3xl border border-line bg-white p-7">
              {person.photo && (
                <Image
                  src={person.photo.src}
                  alt={person.photo.alt}
                  width={480}
                  height={480}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                  className="mb-6 aspect-square w-full rounded-2xl object-cover"
                />
              )}
              <h3 className="type-h3 text-ink">{person.name}</h3>
              <p className="mt-1 text-sm font-semibold text-copy">{person.role}</p>
              <p className="mt-4 leading-relaxed text-copy">{person.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
