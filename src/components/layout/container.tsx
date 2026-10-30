import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("container-site", className)}>{children}</div>;
}

type SectionProps = {
  id?: string;
  tone?: "white" | "paper" | "stone" | "dark";
  className?: string;
  children: React.ReactNode;
  "aria-labelledby"?: string;
};

const tones = {
  white: "bg-white text-ink",
  paper: "bg-paper text-ink",
  stone: "bg-stone text-ink",
  dark: "surface-dark",
} as const;

/** Page section with consistent vertical rhythm and surface tone. */
export function Section({ id, tone = "white", className, children, ...rest }: SectionProps) {
  return (
    <section id={id} className={cn("section-y relative", tones[tone], className)} {...rest}>
      {children}
    </section>
  );
}
