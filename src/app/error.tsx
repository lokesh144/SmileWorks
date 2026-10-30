"use client";

import Link from "next/link";
import { HeroBackdrop } from "@/components/sections/shared/page-hero";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="surface-dark relative isolate overflow-hidden">
      <HeroBackdrop />
      <div className="container-site relative pt-[calc(var(--header-height)+5rem)] pb-28">
        <h1 className="type-h1 text-white">Something went wrong.</h1>
        <p className="type-lead mt-6 max-w-xl text-copy-on-dark">
          We couldn&apos;t load this page. Please try again, or return to the home page.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <Button asChild size="lg" variant="outline-light">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
