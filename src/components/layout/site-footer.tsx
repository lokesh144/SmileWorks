import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ctas, legalNav, mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";

const linkClass =
  "inline-flex rounded-sm text-[0.9375rem] text-copy-on-dark transition-colors duration-200 hover:text-white";

export function SiteFooter() {
  const { contact, social, legal } = siteConfig;
  const hasContact = Boolean(contact.email || contact.phone);
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark relative overflow-hidden border-t border-white/10">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-gold/10 blur-3xl" />
      <div className="container-site relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="dark" />
            <p className="mt-6 max-w-sm leading-relaxed text-copy-on-dark">
              Dedicated remote professionals helping dental practices simplify operations, strengthen patient relationships and grow with confidence.
            </p>
            <Link
              href={ctas.consultation.href}
              className="mt-8 inline-flex items-center gap-2 rounded-sm font-display font-bold text-gold transition-colors hover:text-gold-soft"
            >
              {ctas.consultation.label}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="type-eyebrow text-white">Company</h2>
            <ul className="mt-5 space-y-3">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="type-eyebrow text-white">Services</h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link href={`/services#${service.id}`} className={linkClass}>
                    {service.cardTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="type-eyebrow text-white">Get in touch</h2>
            <ul className="mt-5 space-y-3">
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className={`${linkClass} items-center gap-2 break-all`}>
                    <Mail aria-hidden="true" className="size-4 shrink-0" />
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className={`${linkClass} items-center gap-2`}>
                    <Phone aria-hidden="true" className="size-4 shrink-0" />
                    {contact.phone}
                  </a>
                </li>
              )}
              {!hasContact && (
                <li>
                  <Link href="/contact" className={linkClass}>
                    Send us a message
                  </Link>
                </li>
              )}
              {social.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass} target="_blank" rel="noopener noreferrer">
                    {item.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-copy-on-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {legal.legalName ?? siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
