import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { siteConfig } from "@/config/site";
import type { Service } from "@/data/services";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

/** Per-page metadata with canonical URL, Open Graph and Twitter cards. */
export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = path === "/" ? title : `${title} | ${siteConfig.name}`;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

/** Organization schema built only from verified, configured data. */
export function organizationJsonLd(): Record<string, unknown> {
  const { contact, social, legal } = siteConfig;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl(brand.assets.icon),
    description: siteConfig.description,
  };
  if (legal.legalName) data.legalName = legal.legalName;
  if (contact.email || contact.phone) {
    data.contactPoint = [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        ...(contact.email ? { email: contact.email } : {}),
        ...(contact.phone ? { telephone: contact.phone } : {}),
      },
    ];
  }
  if (social.length > 0) data.sameAs = social.map((item) => item.href);
  return data;
}

export function servicesJsonLd(items: ReadonlyArray<Service>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": items.map((service) => ({
      "@type": "Service",
      "@id": absoluteUrl(`/services#${service.id}`),
      name: service.title,
      serviceType: service.title,
      description: service.summary,
      url: absoluteUrl(`/services#${service.id}`),
      provider: { "@id": absoluteUrl("/#organization") },
    })),
  };
}
