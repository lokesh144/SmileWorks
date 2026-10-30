import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/shared/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Faq } from "@/data/faqs";

export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  lead,
  tone = "white",
}: {
  faqs: ReadonlyArray<Faq>;
  title?: string;
  lead?: string;
  tone?: "white" | "paper";
}) {
  return (
    <Section tone={tone} id="faq" aria-labelledby="faq-heading">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-heading" eyebrow="FAQ" title={title} lead={lead} />
        </div>
        <Reveal className="lg:col-span-8">
          <Accordion type="single" collapsible className="rounded-3xl border border-line bg-white px-6 md:px-8">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}
