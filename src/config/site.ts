/**
 * Central business information. Values that are not yet verified are left
 * `null` and the UI hides them automatically — never fill these with
 * placeholders. Public contact details may also be supplied through the
 * NEXT_PUBLIC_* variables documented in .env.example.
 */

function optionalString(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function optionalHttpsUrl(value: string | undefined): string | null {
  const trimmed = optionalString(value);
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function resolveSiteUrl(): URL {
  const configured = optionalString(process.env.NEXT_PUBLIC_SITE_URL);
  try {
    if (configured) return new URL(configured);
  } catch {
    // Fall through to the local default.
  }
  return new URL("http://localhost:3000");
}

export const siteConfig = {
  name: "SmileWorks Solutions",
  shortName: "SmileWorks",
  tagline: "Smarter support. Stronger dental practices.",
  description:
    "SmileWorks Solutions provides dedicated remote professionals for dental practices — front desk, scheduling, patient recall, billing and insurance coordination, administration and marketing support.",
  url: resolveSiteUrl(),
  locale: "en_US",
  contact: {
    email: optionalString(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: optionalString(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    /** External scheduling link (e.g. Calendly). Only https URLs are accepted. */
    bookingUrl: optionalHttpsUrl(process.env.NEXT_PUBLIC_BOOKING_URL),
  },
  /** Verified social profiles only, e.g. { label: "LinkedIn", href: "https://..." }. */
  social: [] as ReadonlyArray<{ label: string; href: string }>,
  legal: {
    /** Registered legal entity name, if different from the trading name. */
    legalName: null as string | null,
    /**
     * Set to true only after SmileWorks Solutions has completed and approved
     * the privacy notice in src/data/legal.ts. While false the notice is
     * marked as a draft and excluded from search indexing.
     */
    privacyNoticeApproved: false,
    privacyNoticeLastUpdated: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
