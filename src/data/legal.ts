/**
 * Privacy notice — DRAFT.
 *
 * The "website behavior" statements describe what this codebase actually
 * does with consultation-form data. Items in `pendingReview` are
 * company-specific facts that SmileWorks Solutions (and its legal adviser)
 * must supply. Do not invent them. When the notice is complete, set
 * `siteConfig.legal.privacyNoticeApproved` to true.
 */
export type PolicySection = { heading: string; paragraphs: ReadonlyArray<string>; bullets?: ReadonlyArray<string> };

export const privacyNotice: { intro: string; sections: ReadonlyArray<PolicySection>; pendingReview: ReadonlyArray<string> } = {
  intro:
    "This notice explains how information submitted through the consultation form on this website is handled.",
  sections: [
    {
      heading: "Information collected through this website",
      paragraphs: [
        "When you submit the consultation form we receive the details you enter: your name, work email address, optional phone number, organization name, service interest, optional team size and your message, together with the time you gave consent.",
        "The form is intended for business enquiries only. Please do not submit patient health information or other sensitive personal data.",
      ],
    },
    {
      heading: "How the information is used",
      paragraphs: ["Your enquiry is used to respond to your request and to discuss potential services with you."],
      bullets: [
        "The enquiry may be stored in our enquiry database and sent to our team by email.",
        "To protect the form from abuse, a one-way hashed form of your IP address is used for rate limiting. The raw IP address is not stored with your enquiry.",
        "If spam protection (Cloudflare Turnstile) is enabled, the challenge is processed by Cloudflare.",
      ],
    },
    {
      heading: "Cookies and analytics",
      paragraphs: [
        "This website does not set advertising or analytics cookies. If analytics or other tracking tools are added in future, this notice will be updated first.",
      ],
    },
  ],
  pendingReview: [
    "Legal entity name, registered address and privacy contact for SmileWorks Solutions",
    "Legal basis for processing and the jurisdictions whose privacy laws apply",
    "How long enquiries are retained and when they are deleted",
    "Service providers that process enquiry data (for example database hosting and email delivery) and where they are located",
    "How individuals can request access, correction or deletion of their information",
    "Effective date of this notice",
  ],
};
