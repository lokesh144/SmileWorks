"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/animations/magnetic";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { ctas, mainNav } from "@/config/navigation";
import { isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * Sticky header. Every page opens with a dark hero, so the header starts
 * transparent with light text and switches to a light, blurred surface
 * once the page scrolls.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "true" : "false"}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-(--ease-soft)",
        scrolled
          ? "border-line/80 bg-white/90 shadow-[0_10px_30px_-20px_rgb(17_17_17/0.35)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent [--focus:var(--color-gold)]",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between gap-4 transition-[height] duration-500 ease-(--ease-soft)",
          scrolled ? "h-16" : "h-(--header-height)",
        )}
      >
        <Logo tone={scrolled ? "light" : "dark"} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-semibold transition-colors duration-300",
                      scrolled
                        ? "text-ink/75 hover:bg-ink/[0.05] hover:text-ink aria-[current=page]:text-ink"
                        : "text-white/80 hover:bg-white/[0.08] hover:text-white aria-[current=page]:text-white",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute bottom-1 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-gold transition-[opacity,transform] duration-300",
                        active ? "scale-100 opacity-100" : "scale-0 opacity-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Magnetic className="hidden sm:inline-flex">
            <Button asChild size="sm">
              <Link href={ctas.consultation.href}>{ctas.consultation.label}</Link>
            </Button>
          </Magnetic>
          <MobileNav pathname={pathname} scrolled={scrolled} />
        </div>
      </div>
    </header>
  );
}
