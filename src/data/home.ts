import {
  CalendarCheck,
  ClipboardCheck,
  Handshake,
  HeartHandshake,
  Layers,
  ListChecks,
  MessagesSquare,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  UsersRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type IconItem = { icon: LucideIcon; title: string; text: string };

export const hero = {
  eyebrow: "Smarter support. Stronger dental practices.",
  /** Words wrapped in [brackets] are highlighted in gold. */
  heading: "Your Practice Deserves [More] Than Just [Support].",
  lead: "Reliable remote professionals helping dental practices simplify operations, strengthen patient relationships and grow with confidence.",
  floatingLabels: ["Patient Coordination", "Billing Support", "Dedicated Teams"],
} as const;

export const valueProps: ReadonlyArray<IconItem> = [
  {
    icon: UsersRound,
    title: "Dedicated Team Support",
    text: "Professionals who learn your practice and work as part of your team.",
  },
  {
    icon: SlidersHorizontal,
    title: "Flexible Solutions",
    text: "Support shaped around your hours, workflows and priorities.",
  },
  {
    icon: HeartHandshake,
    title: "Patient-Focused Service",
    text: "Warm, professional communication that reflects your standards.",
  },
  {
    icon: Workflow,
    title: "Streamlined Operations",
    text: "Clear processes that help everyday tasks run smoothly.",
  },
];

export const whySmileWorks = {
  eyebrow: "Why SmileWorks",
  heading: "Support that feels like part of your practice.",
  lead: "We focus on the work behind the scenes so your in-office team can focus on patients. Every engagement is built around the way your practice already works.",
  points: [
    {
      icon: UsersRound,
      title: "Dedicated support",
      text: "Consistent team members who get to know your systems, preferences and patients' needs.",
    },
    {
      icon: Workflow,
      title: "Efficient workflows",
      text: "Documented processes and clear handovers so nothing falls between the cracks.",
    },
    {
      icon: Handshake,
      title: "Collaborative teams",
      text: "Remote professionals who work with your staff, not around them.",
    },
    {
      icon: MessagesSquare,
      title: "Dependable communication",
      text: "Agreed check-ins and clear points of contact, so you always know where things stand.",
    },
    {
      icon: Layers,
      title: "Flexible business assistance",
      text: "Start with one area of support and adjust as your practice evolves.",
    },
  ] satisfies ReadonlyArray<IconItem>,
};

export const howItWorks: ReadonlyArray<{ title: string; text: string }> = [
  {
    title: "Tell Us Your Needs",
    text: "Book a free consultation and walk us through your practice, your challenges and where support would make the biggest difference.",
  },
  {
    title: "Find the Right Support",
    text: "We recommend the right roles, hours and scope, then prepare a clear proposal for your review.",
  },
  {
    title: "Work Better Together",
    text: "Your support professional is onboarded to your workflows, with regular check-ins as the partnership grows.",
  },
];

export const outcomes = {
  eyebrow: "The difference support can make",
  heading: "More room for what matters most.",
  lead: "The right support changes how a practice day feels. Here is what our partnership is designed to help with.",
  items: [
    {
      icon: CalendarCheck,
      title: "Time back in your day",
      text: "Routine calls, confirmations and paperwork move off your in-office team's plate.",
    },
    {
      icon: ListChecks,
      title: "Clearer workflows",
      text: "Documented, repeatable processes that make daily operations easier to follow.",
    },
    {
      icon: ClipboardCheck,
      title: "Lighter administrative load",
      text: "Back-office tasks handled on a steady rhythm instead of piling up.",
    },
    {
      icon: Stethoscope,
      title: "Sharper operational focus",
      text: "Owners and clinical teams can concentrate on patient care and growth.",
    },
  ] satisfies ReadonlyArray<IconItem>,
  disclaimer: "Every practice is different — the impact of support depends on your scope, workflows and team.",
};

/** Shown in place of testimonials until verified client feedback is supplied. */
export const differentiators = {
  eyebrow: "What to expect",
  heading: "A partnership built on clarity from the first conversation.",
  items: [
    {
      icon: MessagesSquare,
      title: "A conversation first",
      text: "Your free consultation focuses on understanding your practice — no obligation and no pressure.",
    },
    {
      icon: ClipboardCheck,
      title: "Scope you can see",
      text: "Responsibilities, hours and communication are agreed in writing before work begins.",
    },
    {
      icon: Stethoscope,
      title: "Clear clinical boundaries",
      text: "Our support is administrative. Clinical decisions always stay with your licensed team.",
    },
    {
      icon: Sparkles,
      title: "Room to grow",
      text: "Start focused, then adjust roles and hours as your practice needs change.",
    },
  ] satisfies ReadonlyArray<IconItem>,
};
