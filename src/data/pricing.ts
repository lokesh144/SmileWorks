import {
  Clock3,
  GraduationCap,
  Layers,
  ShieldCheck,
  UserRoundCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const pricingFactors: ReadonlyArray<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: UserRoundCheck, title: "Role", text: "The responsibilities involved — reception, scheduling, billing, administration or a mix." },
  { icon: Clock3, title: "Hours", text: "Part-time, full-time or coverage for specific times of day." },
  { icon: Wrench, title: "Skills", text: "The experience and system knowledge the role requires." },
  { icon: Layers, title: "Scope", text: "The volume and variety of tasks, and how many workflows are involved." },
  { icon: GraduationCap, title: "Training", text: "Onboarding to your systems, processes and communication style." },
  { icon: ShieldCheck, title: "Service level", text: "Reporting, check-ins, coverage arrangements and points of contact." },
];

/** Team-size values must match `teamSizeOptions` in src/lib/validation/consultation.ts. */
export type Engagement = {
  id: "focused-support" | "dedicated-team-member" | "custom-team-solution";
  title: string;
  summary: string;
  bestFor: string;
  possibleInclusions: ReadonlyArray<string>;
  teamSize: "part-time" | "one" | "multiple";
  featured?: boolean;
};

export const engagements: ReadonlyArray<Engagement> = [
  {
    id: "focused-support",
    title: "Focused Support",
    summary: "Targeted help for a specific workflow or a defined set of tasks.",
    bestFor: "Practices that need support in one area, such as confirmations, recall or insurance verification.",
    possibleInclusions: [
      "A clearly defined set of tasks",
      "Agreed working hours",
      "Onboarding to the relevant workflow",
      "Regular progress updates",
    ],
    teamSize: "part-time",
  },
  {
    id: "dedicated-team-member",
    title: "Dedicated Team Member",
    summary: "A consistent professional who becomes an extension of your practice team.",
    bestFor: "Practices wanting ongoing, day-to-day support across several related responsibilities.",
    possibleInclusions: [
      "One dedicated professional",
      "Responsibilities across related workflows",
      "Onboarding to your systems and processes",
      "Scheduled check-ins and a point of contact",
    ],
    teamSize: "one",
    featured: true,
  },
  {
    id: "custom-team-solution",
    title: "Custom Team Solution",
    summary: "A coordinated group of professionals covering multiple roles or locations.",
    bestFor: "Growing practices and multi-location groups with broader operational needs.",
    possibleInclusions: [
      "Multiple roles working together",
      "Coordinated coverage and handovers",
      "Shared documentation and processes",
      "Structured reviews as the team evolves",
    ],
    teamSize: "multiple",
  },
];

export const engagementDisclaimer =
  "These are engagement options, not fixed-price plans. Pricing, inclusions and terms are confirmed in a written quote after your consultation.";

export const comparisonRows: ReadonlyArray<{ label: string; values: [string, string, string] }> = [
  {
    label: "Typical scope",
    values: ["One defined workflow", "Several related responsibilities", "Multiple roles or functions"],
  },
  {
    label: "Team structure",
    values: ["Assigned support professional", "One dedicated professional", "Coordinated group of professionals"],
  },
  {
    label: "Working hours",
    values: ["Part-time or task-based", "Part-time or full-time", "Planned across roles and schedules"],
  },
  {
    label: "Communication",
    values: ["Progress updates", "Scheduled check-ins", "Structured team reviews"],
  },
  {
    label: "Flexibility",
    values: ["Add tasks as needs grow", "Adjust hours and responsibilities", "Add or rebalance roles"],
  },
];

export const onboardingSteps: ReadonlyArray<{ title: string; text: string }> = [
  {
    title: "Discovery consultation",
    text: "A free conversation about your practice, current workload and goals.",
  },
  {
    title: "Scope & proposal",
    text: "We recommend roles, hours and responsibilities and send a quote for your review.",
  },
  {
    title: "Matching & preparation",
    text: "We identify the right support professional and plan system access and security requirements with you.",
  },
  {
    title: "Onboarding & training",
    text: "Your support professional learns your systems, workflows, scripts and preferences.",
  },
  {
    title: "Go live with check-ins",
    text: "Support begins with closer check-ins during the early weeks to fine-tune processes.",
  },
  {
    title: "Ongoing review",
    text: "We review progress together and adjust scope as your practice evolves.",
  },
];
