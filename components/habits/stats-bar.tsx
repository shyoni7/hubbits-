import { FlameIcon } from "@/components/icons";

type Props = { doneToday: number; activeCount: number; weekly: number; longestStreak: number };

export function StatsBar({ doneToday, activeCount, weekly, longestStreak }: Props) {
  const daily = activeCount === 0 ? 0 : doneToday / activeCount;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const allDone = activeCount > 0 && doneToday === activeCount;

  return (
    <section aria-label="Your progress" className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex items-center gap-4 rounded-card border border-border bg-surface p-4 shadow-soft">
        <div className="relative size-16 shrink-0">
          <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden="true">
            <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="6" className="stroke-surface-2" />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - daily)}
              className="stroke-accent transition-[stroke-dashoffset] duration-700 ease-(--ease-soft)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">
            {doneToday}/{activeCount}
          </span>
        </div>
        <div>
          <p className="text-xs text-muted">Today</p>
          <p className="font-semibold">{allDone ? "All done. Nice!" : `${activeCount - doneToday} left`}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center rounded-card border border-border bg-surface p-4 shadow-soft">
        <div className="flex items-baseline justify-between">
          <p className="text-xs text-muted">This week</p>
          <p className="text-2xl font-semibold tabular-nums">{weekly}%</p>
        </div>
        <div
          role="progressbar"
          aria-label="Weekly completion"
          aria-valuenow={weekly}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-700 ease-(--ease-soft)"
            style={{ width: `${weekly}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-card border border-border bg-surface p-4 shadow-soft">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <FlameIcon className="size-6" />
        </span>
        <div>
          <p className="text-xs text-muted">Longest active streak</p>
          <p className="text-2xl font-semibold tabular-nums">
            {longestStreak} <span className="text-sm font-normal text-muted">{longestStreak === 1 ? "day" : "days"}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
