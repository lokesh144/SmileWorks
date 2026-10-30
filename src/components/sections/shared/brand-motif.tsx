import { cn } from "@/lib/utils";

/**
 * Abstract decorative motif echoing the logo's human-centered shapes — a
 * head-like circle above an uplifting curve. Purely decorative; it is not a
 * substitute for the logo.
 */
export function BrandMotif({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 600 600"
      fill="none"
      className={cn("pointer-events-none", className)}
    >
      <circle cx="300" cy="300" r="290" stroke="currentColor" strokeOpacity="0.08" />
      <circle cx="300" cy="300" r="220" stroke="currentColor" strokeOpacity="0.08" />
      <circle cx="300" cy="300" r="150" stroke="currentColor" strokeOpacity="0.06" />
      <path d="M90 330c60 120 190 170 300 120 70-32 120-95 140-170" stroke="#FFC629" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      <path d="M130 360c55 80 150 112 235 82" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" />
      <circle cx="318" cy="205" r="26" fill="#FFC629" fillOpacity="0.85" />
    </svg>
  );
}
