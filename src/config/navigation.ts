export type NavLink = {
  label: string;
  href: string;
};

export const mainNav: ReadonlyArray<NavLink> = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: ReadonlyArray<NavLink> = [{ label: "Privacy Notice", href: "/privacy" }];

export const ctas = {
  consultation: { label: "Book a Free Consultation", href: "/contact" },
  services: { label: "Explore Our Services", href: "/services" },
  quote: { label: "Request a Quote", href: "/contact" },
  pricing: { label: "See Pricing & Process", href: "/pricing" },
  about: { label: "About SmileWorks", href: "/about" },
} as const satisfies Record<string, NavLink>;
