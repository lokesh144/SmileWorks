import Link from "next/link";
import { PageHero } from "@/components/sections/shared/page-hero";
import { Button } from "@/components/ui/button";
import { ctas } from "@/config/navigation";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      title="We couldn't find that [page]."
      lead="The page may have moved or no longer exists. Here are a few helpful places to continue."
    >
      <Button asChild size="lg">
        <Link href="/">Back to home</Link>
      </Button>
      <Button asChild size="lg" variant="outline-light">
        <Link href={ctas.services.href}>{ctas.services.label}</Link>
      </Button>
    </PageHero>
  );
}
