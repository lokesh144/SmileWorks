import {
  BriefcaseBusiness,
  CalendarCheck,
  Headset,
  Megaphone,
  ReceiptText,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";

/**
 * Proposed service categories. These describe support that MAY be arranged —
 * confirm every capability with SmileWorks Solutions operations before
 * launch, and remove or edit anything that is not offered. Set `enabled` to
 * false to hide a service everywhere (cards, detail sections, form options
 * and structured data).
 */
export type Service = {
  id: string;
  enabled: boolean;
  title: string;
  /** Shorter title used on the home page grid. */
  cardTitle: string;
  icon: LucideIcon;
  summary: string;
  description: string;
  tasks: ReadonlyArray<string>;
  idealFor: ReadonlyArray<string>;
  benefits: ReadonlyArray<{ title: string; text: string }>;
  boundary?: string;
};

const allServices: ReadonlyArray<Service> = [
  {
    id: "virtual-front-desk",
    enabled: true,
    title: "Virtual Front Desk & Reception",
    cardTitle: "Virtual Front Desk",
    icon: Headset,
    summary:
      "A friendly, professional first point of contact who answers calls, responds to enquiries and keeps your front office moving.",
    description:
      "A remote receptionist works alongside your in-office team to handle routine communication, so patients get timely responses and your staff can focus on the people in the chair.",
    tasks: [
      "Answer and route incoming calls using your scripts and escalation rules",
      "Respond to web, email and messaging enquiries",
      "Capture new-patient details and prepare intake paperwork",
      "Manage voicemail and callback lists",
      "Pass clinical or urgent questions straight to your team",
    ],
    idealFor: [
      "Practices missing calls during busy periods or lunch hours",
      "Front desks stretched between check-in and the phone",
      "Practices that want consistent, scripted patient communication",
    ],
    benefits: [
      { title: "Fewer missed calls", text: "Extra coverage during the moments your desk is busiest." },
      { title: "Calmer front office", text: "In-office staff can give full attention to patients on site." },
      { title: "Consistent experience", text: "Every enquiry follows the process your practice defines." },
    ],
    boundary:
      "Reception support is administrative only. Clinical questions, triage and treatment advice always remain with your licensed team.",
  },
  {
    id: "appointment-scheduling",
    enabled: true,
    title: "Appointment Scheduling & Confirmations",
    cardTitle: "Appointment & Patient Coordination",
    icon: CalendarCheck,
    summary:
      "Organized schedules, timely confirmations and smooth rescheduling — coordinated around the way your practice books.",
    description:
      "A dedicated coordinator manages the day-to-day work of keeping your schedule full and accurate, following your booking rules and provider preferences.",
    tasks: [
      "Book, reschedule and cancel appointments in your system",
      "Send and follow up on appointment confirmations",
      "Work short-notice lists to help fill openings",
      "Coordinate patient reminders and pre-visit information",
      "Keep schedule notes and patient contact details up to date",
    ],
    idealFor: [
      "Practices with frequent last-minute changes",
      "Multi-provider schedules that need careful coordination",
      "Teams that want confirmations handled consistently",
    ],
    benefits: [
      { title: "Clearer days", text: "Better-prepared schedules with fewer surprises." },
      { title: "Proactive follow-up", text: "Confirmations and changes handled before they become gaps." },
      { title: "Time back", text: "Less phone time for your in-office team." },
    ],
  },
  {
    id: "patient-recall",
    enabled: true,
    title: "Patient Recall & Reactivation",
    cardTitle: "Patient Recall & Reactivation",
    icon: RefreshCcw,
    summary:
      "Thoughtful, consistent outreach that reminds patients when they're due and welcomes overdue patients back.",
    description:
      "Recall work is easy to postpone when the day gets busy. A recall specialist works your lists methodically so patients receive friendly, well-timed reminders.",
    tasks: [
      "Work recall and overdue-patient lists by phone, email or text",
      "Follow up on unscheduled treatment as directed by your team",
      "Record outreach attempts and outcomes in your system",
      "Update contact preferences and patient details",
      "Share simple progress summaries with your practice",
    ],
    idealFor: [
      "Practices with a growing backlog of overdue patients",
      "Teams without dedicated time for outreach",
      "Practices wanting a steady, documented recall routine",
    ],
    benefits: [
      { title: "Consistent outreach", text: "Recall happens on schedule, not only when there's spare time." },
      { title: "Stronger relationships", text: "Patients feel remembered and cared for." },
      { title: "Visibility", text: "Clear records of who was contacted and what happened next." },
    ],
  },
  {
    id: "billing-insurance",
    enabled: true,
    title: "Dental Billing & Insurance Coordination",
    cardTitle: "Dental Billing & Insurance Support",
    icon: ReceiptText,
    summary:
      "Organized support for eligibility checks, claim follow-up and patient account administration.",
    description:
      "Billing support helps keep insurance and account tasks moving. Work follows your practice's policies, with financial decisions and approvals remaining under your oversight.",
    tasks: [
      "Verify insurance eligibility and benefits ahead of appointments",
      "Prepare and submit claims according to your practice's process",
      "Follow up on outstanding or delayed claims",
      "Post payments and help reconcile patient accounts",
      "Prepare patient statements and answer routine billing questions",
    ],
    idealFor: [
      "Practices with a backlog of unresolved claims",
      "Teams where billing competes with front-desk duties",
      "Practices that want insurance details confirmed before visits",
    ],
    benefits: [
      { title: "Better-prepared visits", text: "Coverage details checked before patients arrive." },
      { title: "Organized follow-up", text: "Outstanding items tracked instead of forgotten." },
      { title: "Shared visibility", text: "Clear notes your team can review at any time." },
    ],
    boundary:
      "Coding and claim decisions, write-offs and financial approvals remain the responsibility of your practice.",
  },
  {
    id: "admin-finance",
    enabled: true,
    title: "Administrative, Accounting & Payroll Assistance",
    cardTitle: "Administrative & Finance Support",
    icon: BriefcaseBusiness,
    summary:
      "Reliable help with the back-office work that keeps a practice organized — documents, data entry, bookkeeping and payroll preparation.",
    description:
      "Administrative assistants take on structured, repeatable tasks so practice owners and managers can spend more time leading the team.",
    tasks: [
      "Data entry, document management and records organization",
      "Accounts payable and receivable support",
      "Bookkeeping assistance and report preparation",
      "Payroll preparation for review by your accountant or manager",
      "Vendor, supply and calendar coordination",
    ],
    idealFor: [
      "Owners and managers spending evenings on paperwork",
      "Growing practices without a full-time office manager",
      "Practices that want back-office tasks documented and routine",
    ],
    benefits: [
      { title: "Lighter workload", text: "Repetitive admin is handled on a predictable rhythm." },
      { title: "Better organization", text: "Documents and records kept tidy and accessible." },
      { title: "Leadership time", text: "More time for strategy, people and patients." },
    ],
    boundary:
      "Assistance supports — and does not replace — your licensed accountant, payroll provider or financial advisers.",
  },
  {
    id: "marketing-it",
    enabled: true,
    title: "Marketing & IT Support",
    cardTitle: "Marketing & Technical Support",
    icon: Megaphone,
    summary:
      "Practical help with your online presence, patient communications and everyday technical tasks.",
    description:
      "Support for the digital side of your practice — keeping content fresh, reviews organized and day-to-day technology tasks under control.",
    tasks: [
      "Prepare social media posts and patient newsletters for approval",
      "Update website content and online business listings",
      "Monitor and organize patient reviews for your team's response",
      "Basic software administration, user set-up and troubleshooting",
      "Coordinate with your existing IT or marketing vendors",
    ],
    idealFor: [
      "Practices with an inconsistent online presence",
      "Teams without in-house marketing or IT help",
      "Practices wanting routine digital tasks handled reliably",
    ],
    benefits: [
      { title: "Consistent presence", text: "Regular, on-brand communication with patients." },
      { title: "Fewer interruptions", text: "Everyday tech issues handled without derailing the day." },
      { title: "Your approval", text: "Public content is prepared for your review before it goes live." },
    ],
  },
];

export const services: ReadonlyArray<Service> = allServices.filter((service) => service.enabled);

export const serviceScopeNote =
  "Service scope is agreed with each practice. Tasks listed are examples of support that can be arranged and depend on the role, your systems and the terms of your engagement.";

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}
