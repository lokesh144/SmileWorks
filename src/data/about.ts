import {
  Building,
  Building2,
  Cog,
  Ear,
  HeartHandshake,
  MessagesSquare,
  Network,
  Smile,
  Sprout,
  Target,
  Telescope,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type IconItem = { icon: LucideIcon; title: string; text: string };

export const brandStory = {
  eyebrow: "Our story",
  heading: "Built around the people who keep practices running.",
  paragraphs: [
    "Dental practices run on people — the clinicians who care for patients and the teams who keep everything around them organized. When administrative work piles up, it's those same people who feel the strain.",
    "SmileWorks Solutions was created to lighten that load. We connect practices with dedicated remote professionals who handle the essential work behind the scenes, so in-office teams can give patients their full attention.",
    "We believe great support is personal. It means learning how each practice works, communicating clearly and earning trust through consistency — one day, one task and one patient interaction at a time.",
  ],
};

export const missionVision: ReadonlyArray<IconItem> = [
  {
    icon: Target,
    title: "Our mission",
    text: "To help dental practices operate with less stress and more focus by providing dependable, people-first remote support.",
  },
  {
    icon: Telescope,
    title: "Our vision",
    text: "A dental industry where every practice — whatever its size — has access to the support it needs to grow with confidence.",
  },
];

/** The four brand themes from the SmileWorks brand board. */
export const values: ReadonlyArray<IconItem & { tagline: string }> = [
  {
    icon: Smile,
    title: "Positivity",
    tagline: "Happier teams",
    text: "We bring warmth and optimism to every interaction, because a positive team creates a better patient experience.",
  },
  {
    icon: UsersRound,
    title: "People First",
    tagline: "Support that cares",
    text: "Patients, practice teams and our own professionals are at the center of every decision we make.",
  },
  {
    icon: Cog,
    title: "Smart Solutions",
    tagline: "Modern and efficient",
    text: "We look for practical, well-organized ways of working that save time without cutting corners.",
  },
  {
    icon: TrendingUp,
    title: "Growth Together",
    tagline: "Stronger tomorrow",
    text: "Our success is measured by yours. We grow alongside the practices we support.",
  },
];

export const audiences: ReadonlyArray<IconItem> = [
  {
    icon: Building,
    title: "Independent practices",
    text: "Owner-led practices that want reliable help without the overhead of expanding their in-office team.",
  },
  {
    icon: Sprout,
    title: "Growing practices",
    text: "Practices adding providers, hours or locations that need support to scale smoothly.",
  },
  {
    icon: Building2,
    title: "Specialty practices",
    text: "Specialists who need coordinated scheduling, communication and administrative follow-through.",
  },
  {
    icon: Network,
    title: "Multi-location groups",
    text: "Groups looking for consistent processes and coordinated support across sites.",
  },
];

export const philosophy: ReadonlyArray<{ title: string; text: string }> = [
  {
    title: "Learn first, then support",
    text: "We take time to understand your systems, people and patients before suggesting how we can help.",
  },
  {
    title: "Work your way",
    text: "Our professionals follow your processes, tone and priorities — we adapt to your practice, not the other way around.",
  },
  {
    title: "Keep it simple",
    text: "Clear responsibilities, clear handovers and clear documentation make support easy to rely on.",
  },
  {
    title: "Improve continuously",
    text: "Regular reviews help us refine workflows and adjust support as your needs change.",
  },
];

export const communicationCommitments: ReadonlyArray<IconItem> = [
  {
    icon: MessagesSquare,
    title: "Agreed check-ins",
    text: "A regular rhythm of updates that suits your practice.",
  },
  {
    icon: HeartHandshake,
    title: "A clear point of contact",
    text: "You'll always know who to talk to about your support.",
  },
  {
    icon: Ear,
    title: "Listening to feedback",
    text: "Your input shapes how support evolves over time.",
  },
];

/**
 * Leadership and team profiles. Leave empty until real, approved profiles
 * (and properly licensed photos) are supplied — the section is hidden while
 * this list is empty.
 */
export type TeamMember = { name: string; role: string; bio: string; photo?: { src: string; alt: string } };
export const leadership: ReadonlyArray<TeamMember> = [];
