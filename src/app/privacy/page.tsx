import { TriangleAlert } from "lucide-react";
import { PageHero } from "@/components/sections/shared/page-hero";
import { siteConfig } from "@/config/site";
import { privacyNotice } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

const approved = siteConfig.legal.privacyNoticeApproved;

export const metadata = buildMetadata({
  title: "Privacy Notice",
  description: "How SmileWorks Solutions handles information submitted through this website.",
  path: "/privacy",
  noIndex: !approved,
});

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const listClass = "mt-4 list-disc space-y-2 pl-5 leading-relaxed text-copy marker:text-ink";

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Notice" lead={privacyNotice.intro} />
      <section className="section-y bg-white">
        <div className="container-site">
          <article className="max-w-3xl space-y-12">
            {!approved && (
              <div role="note" className="flex gap-3 rounded-2xl border border-gold bg-gold/15 p-5 text-sm leading-relaxed text-ink">
                <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <p>
                  <strong>Draft — pending review by SmileWorks Solutions.</strong> This notice describes how this website
                  handles form submissions. Company-specific details listed at the end of this page must be completed
                  before it is final.
                </p>
              </div>
            )}

            {privacyNotice.sections.map((section) => (
              <section key={section.heading} aria-labelledby={slug(section.heading)}>
                <h2 id={slug(section.heading)} className="type-h3 text-ink">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-relaxed text-copy">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className={listClass}>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {!approved && (
              <section aria-labelledby="pending-review" className="rounded-3xl border border-dashed border-ink/25 bg-paper p-7">
                <h2 id="pending-review" className="type-h3 text-ink">
                  Details to be confirmed by SmileWorks Solutions
                </h2>
                <ul className={listClass}>
                  {privacyNotice.pendingReview.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {siteConfig.legal.privacyNoticeLastUpdated && (
              <p className="text-sm text-copy">Last updated: {siteConfig.legal.privacyNoticeLastUpdated}</p>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
