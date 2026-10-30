import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/brand";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Brand lock-up: the supplied app-icon mark with the SmileWorks wordmark set in type. */
export function Logo({
  tone = "dark",
  className,
  onNavigate,
}: {
  /** Surface the logo sits on. */
  tone?: "dark" | "light";
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={`${siteConfig.name} — home`}
      className={cn("group inline-flex items-center gap-3 rounded-xl", className)}
    >
      <Image
        src={brand.assets.icon}
        alt=""
        width={44}
        height={44}
        loading="eager"
        className="size-10 rounded-[11px] transition-transform duration-500 ease-(--ease-out-expo) group-hover:-rotate-6 sm:size-11"
      />
      <span className="flex flex-col leading-none" aria-hidden="true">
        <span className={cn("font-display text-[1.3rem] font-extrabold tracking-[-0.03em]", tone === "dark" ? "text-white" : "text-ink")}>
          Smile<span className="text-gold">Works</span>
        </span>
        <span
          className={cn(
            "mt-1 font-display text-[0.6rem] font-semibold tracking-[0.42em]",
            tone === "dark" ? "text-white/70" : "text-copy",
          )}
        >
          SOLUTIONS
        </span>
      </span>
    </Link>
  );
}
