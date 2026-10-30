import Image from "next/image";
import { CalendarCheck, Check, ReceiptText, UsersRound, type LucideIcon } from "lucide-react";
import { brand } from "@/config/brand";
import { hero } from "@/data/home";
import { cn } from "@/lib/utils";

const schedule = [
  { time: "08:00", label: "New patient intake", status: "Ready" },
  { time: "09:30", label: "Hygiene recall calls", status: "In progress" },
  { time: "11:00", label: "Insurance verification", status: "Ready" },
  { time: "13:30", label: "Appointment confirmations", status: "Queued" },
];

const tasks = [
  { label: "Confirm tomorrow's schedule", done: true },
  { label: "Follow up on recall list", done: true },
  { label: "Update insurance notes", done: false },
];

const labelIcons: ReadonlyArray<LucideIcon> = [CalendarCheck, ReceiptText, UsersRound];

/**
 * Illustrative product-style composition (not a screenshot of real data).
 * Exposed to assistive tech as a single described image.
 */
export function HeroVisual() {
  return (
    <div
      role="img"
      aria-label="Illustration of a remote support workspace coordinating a dental practice's schedule, insurance verification and recall tasks"
      className="relative mx-auto w-full max-w-[540px] lg:max-w-none"
    >
      {/* Main panel */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-b from-graphite to-ink-soft p-5 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] sm:p-7">
        <Image
          src={brand.assets.markOnDark}
          alt=""
          width={295}
          height={201}
          className="pointer-events-none absolute -right-10 -bottom-8 w-64 opacity-[0.07]"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-gold/80" />
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] font-semibold tracking-wide text-white/60">
            Practice operations
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-white/50">Today&apos;s support plan</p>
            <p className="mt-1 font-display text-xl font-bold text-white">Front office overview</p>
          </div>
          <span className="grid size-10 place-items-center rounded-xl bg-gold text-ink">
            <CalendarCheck className="size-5" strokeWidth={1.75} />
          </span>
        </div>

        <ul className="mt-6 space-y-2.5">
          {schedule.map((item) => (
            <li key={item.time} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3">
              <span className="w-12 shrink-0 font-display text-sm font-bold text-gold">{item.time}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-white/85">{item.label}</span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold",
                  item.status === "Ready" && "bg-gold/15 text-gold",
                  item.status === "In progress" && "bg-white/10 text-white/80",
                  item.status === "Queued" && "border border-white/10 text-white/50",
                )}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {["Calls", "Follow-ups", "Billing"].map((label, index) => (
            <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
              <p className="text-[0.68rem] font-medium text-white/50">{label}</p>
              <div className="mt-3 h-1.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gold" style={{ width: `${[72, 54, 38][index]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task card */}
      <div className="relative -mt-10 ml-auto w-[78%] rounded-3xl border border-line bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] sm:w-[62%] lg:motion-safe:animate-float-delayed">
        <p className="font-display text-sm font-bold">Support task queue</p>
        <ul className="mt-3 space-y-2.5">
          {tasks.map((task) => (
            <li key={task.label} className="flex items-center gap-2.5 text-[0.8rem] text-copy">
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border",
                  task.done ? "border-gold bg-gold text-ink" : "border-line",
                )}
              >
                {task.done && <Check className="size-3" strokeWidth={3} />}
              </span>
              {task.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Floating labels */}
      {hero.floatingLabels.map((label, index) => {
        const Icon = labelIcons[index % labelIcons.length];
        return (
          <span
            key={label}
            className={cn(
              "absolute hidden items-center gap-2 rounded-full border border-white/15 bg-ink/80 py-2 pr-4 pl-2 text-[0.8rem] font-semibold text-white shadow-lg backdrop-blur-md sm:inline-flex",
              index === 0 && "top-24 -left-4 lg:-left-10 lg:motion-safe:animate-float",
              index === 1 && "top-1/2 -right-3 lg:-right-8 lg:motion-safe:animate-float-delayed",
              index === 2 && "bottom-12 -left-3 lg:-left-8 lg:motion-safe:animate-float",
            )}
          >
            <span className="grid size-7 place-items-center rounded-full bg-gold text-ink">
              <Icon className="size-3.5" strokeWidth={2} />
            </span>
            {label}
          </span>
        );
      })}
    </div>
  );
}
