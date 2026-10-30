import type { MetadataRoute } from "next";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = mainNav.map((link) => ({
    url: absoluteUrl(link.href),
    changeFrequency: "monthly" as const,
    priority: link.href === "/" ? 1 : 0.8,
  }));
  if (siteConfig.legal.privacyNoticeApproved) {
    pages.push({ url: absoluteUrl("/privacy"), changeFrequency: "monthly", priority: 0.3 });
  }
  return pages;
}
