import { headers } from "next/headers";
import { CalendarDays, Mail, Phone, ShieldAlert } from "lucide-react";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { PageHero } from "@/components/sections/shared/page-hero";
import { Eyebrow } from "@/components/ui/eyebrow";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { isServiceInterest, isTeamSize } from "@/lib/validation/consultation";

export const metadata = buildMetadata({
  title: "Contact & Book a Free Consultation",
  description:
    "Tell us about your dental practice and the support you need. Book a free, no-obligation consultation with SmileWorks Solutions.",
  path: "/contact",
});

const nextSteps = [
  { title: "We review your request", text: "Your details go directly to our team." },
  { title: "We get in touch", text: "We'll contact you to arrange a convenient time for your free consultation." },
  { title: "We recommend a plan", text: "After the consultation, you'll receive a recommendation and quote to review." },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const service = typeof params.service === "string" && isServiceInterest(params.service) ? params.service : "";
  const team = typeof params.team === "string" && isTeamSize(params.team) ? params.team : "";
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;
  const { email, phone, bookingUrl } = siteConfig.contact;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Build a Better Way to [Work]."
        lead="Share a little about your practice and where you need support. We'll be in touch to arrange your free, no-obligation consultation."
      />

      <section aria-labelledby="form-heading" className="section-y bg-paper">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="rounded-[28px] border border-line bg-white p-6 shadow-(--shadow-card) sm:p-8 md:p-10 lg:col-span-7">
            <h2 id="form-heading" className="type-h3 text-ink">
              Book a free consultation
            </h2>
            <p className="mt-2 mb-8 text-copy">It only takes a couple of minutes.</p>
            <ConsultationForm
              defaultService={service}
              defaultTeamSize={team}
              privacyHref="/privacy"
              turnstileSiteKey={turnstileSiteKey}
              nonce={nonce}
            />
          </div>

          <aside aria-label="What happens next and contact details" className="space-y-6 lg:col-span-5">
            <div className="surface-dark rounded-[28px] p-8 md:p-10">
              <Eyebrow tone="dark">What happens next</Eyebrow>
              <ol className="mt-8 space-y-7">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-gold font-display text-sm font-extrabold text-ink">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-copy-on-dark">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {(email || phone || bookingUrl) && (
              <div className="rounded-[28px] border border-line bg-white p-8">
                <h2 className="font-display text-lg font-bold text-ink">Prefer to reach us directly?</h2>
                <ul className="mt-5 space-y-4">
                  {bookingUrl && (
                    <li>
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4"
                      >
                        <CalendarDays aria-hidden="true" className="size-5" />
                        Schedule a call online
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  )}
                  {email && (
                    <li>
                      <a href={`mailto:${email}`} className="inline-flex items-center gap-3 font-semibold break-all text-ink underline decoration-gold decoration-2 underline-offset-4">
                        <Mail aria-hidden="true" className="size-5 shrink-0" />
                        {email}
                      </a>
                    </li>
                  )}
                  {phone && (
                    <li>
                      <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-3 font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4">
                        <Phone aria-hidden="true" className="size-5" />
                        {phone}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-4 rounded-[28px] border border-line bg-white p-6">
              <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink" />
              <p className="text-sm leading-relaxed text-copy">
                <strong className="text-ink">Please don&apos;t share patient information.</strong> This form is for business enquiries
                only — never include patient names, health details or records.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
