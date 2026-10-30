/**
 * FAQ content. Answers intentionally avoid guarantees; review with
 * SmileWorks Solutions before launch and update as policies are confirmed.
 */
export type Faq = { question: string; answer: string };

export const servicesFaqs: ReadonlyArray<Faq> = [
  {
    question: "Do your team members provide clinical care or medical advice?",
    answer:
      "No. SmileWorks Solutions provides administrative and business support only. Any clinical question, triage decision or treatment discussion is passed to your licensed dental team.",
  },
  {
    question: "Which practice management software can your team work with?",
    answer:
      "We'll ask about your current systems during the consultation. Compatibility, access method and any training needs are confirmed before work begins.",
  },
  {
    question: "How is patient information protected?",
    answer:
      "Access arrangements, confidentiality commitments and data-handling procedures are discussed and agreed with your practice before any access to patient systems is granted, in line with the requirements that apply to your practice.",
  },
  {
    question: "Can we start with one service and add more later?",
    answer:
      "Yes — many practices prefer to start with a focused area of support. Scope can be reviewed and adjusted as your needs change, subject to agreement.",
  },
  {
    question: "What hours can support cover?",
    answer:
      "Working hours are planned around your practice's schedule and time zone. Coverage is discussed during the consultation and confirmed in your proposal.",
  },
  {
    question: "How quickly can support begin?",
    answer:
      "Timing depends on the role, scope and onboarding required. We'll outline a realistic timeline once we understand your needs.",
  },
];

export const pricingFaqs: ReadonlyArray<Faq> = [
  {
    question: "Why don't you publish fixed prices?",
    answer:
      "Every practice needs a different mix of roles, hours and responsibilities. Rather than publishing packages that may not fit, we prepare a quote based on your actual requirements.",
  },
  {
    question: "What affects the cost of support?",
    answer:
      "The main factors are the role and responsibilities, hours and coverage, required skills and experience, scope and volume of work, onboarding and training needs, and the service level you need.",
  },
  {
    question: "Is there a minimum commitment?",
    answer:
      "Commitment terms depend on the engagement and are set out clearly in your proposal before you decide to proceed.",
  },
  {
    question: "Can we change our engagement later?",
    answer:
      "Engagements can be reviewed as your practice evolves — for example adding hours, roles or responsibilities — subject to agreement.",
  },
  {
    question: "Is the consultation really free?",
    answer:
      "Yes. The consultation is a no-obligation conversation to understand your practice and discuss whether our support is a good fit.",
  },
];
