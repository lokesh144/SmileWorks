"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { isActivePath } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ctas, mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

/**
 * Mobile/tablet navigation drawer built on Radix Dialog: focus is trapped
 * while open, Escape closes it and focus returns to the menu button.
 */
export function MobileNav({ pathname, scrolled }: { pathname: string; scrolled: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => media.matches && setOpen(false);
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={cn(
            "grid size-11 place-items-center rounded-full border transition-colors lg:hidden",
            scrolled ? "border-line bg-white text-ink hover:border-ink/40" : "border-white/20 text-white hover:bg-white/10",
          )}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto border-l border-white/10 p-0 sm:max-w-md surface-dark bg-black/70"
      >
        <div className="flex h-18 items-center px-5">
          <Logo tone="dark" onNavigate={() => setOpen(false)} />
        </div>
        <SheetTitle className="sr-only">Site navigation</SheetTitle>
        <SheetDescription className="sr-only">Links to every page of the SmileWorks Solutions website.</SheetDescription>

        <nav aria-label="Mobile" className="px-5 pt-6">
          <ul className="flex flex-col">
            {mainNav.map((link, index) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li
                  key={link.href}
                  className="animate-in fill-mode-both fade-in slide-in-from-right-6 duration-500"
                  style={{ animationDelay: `${120 + index * 60}ms` }}
                >
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl font-bold tracking-[-0.02em] text-white/85 transition-colors hover:text-white aria-[current=page]:text-gold"
                    >
                      {link.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 text-white/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                      />
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className="mt-auto animate-in fill-mode-both fade-in slide-in-from-bottom-4 p-5 pt-10 duration-500"
          style={{ animationDelay: "480ms" }}
        >
          <p className="mb-4 text-sm leading-relaxed text-copy-on-dark">
            Tell us about your practice and we&apos;ll recommend the right support.
          </p>
          <SheetClose asChild>
            <Button asChild size="lg" className="w-full">
              <Link href={ctas.consultation.href}>
                {ctas.consultation.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
