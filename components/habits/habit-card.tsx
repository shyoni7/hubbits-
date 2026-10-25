"use client";

import { useMemo, type CSSProperties } from "react";
import { ArchiveIcon, CheckIcon, FlameIcon, PencilIcon, RestoreIcon, TrashIcon, TrophyIcon } from "@/components/icons";
import { formatDate } from "@/lib/dates";
import { habitColorVar } from "@/lib/habit-options";
import { bestStreak, currentStreak, history } from "@/lib/streaks";
import type { HabitWithLogs } from "@/lib/types";

type Props = {
  habit: HabitWithLogs;
  today: string;
  onToggle: (done: boolean) => void;
  onEdit: () => void;
  onArchive: (archived: boolean) => void;
  onDelete: () => void;
};

function days(n: number) {
  return `${n} ${n === 1 ? "day" : "days"}`;
}

export function HabitCard({ habit, today, onToggle, onEdit, onArchive, onDelete }: Props) {
  const stats = useMemo(
    () => ({
      current: currentStreak(habit.doneDates, today),
      best: bestStreak(habit.doneDates),
      grid: history(habit.doneDates, today, 30),
    }),
    [habit.doneDates, today],
  );
  const doneToday = habit.doneDates.includes(today);
  const archived = Boolean(habit.archived);
  const target = habit.target_per_week ?? 7;
  const doneCount = stats.grid.filter((d) => d.done).length;

  return (
    <article
      style={{ "--habit": habitColorVar(habit.color) } as CSSProperties}
      className={`flex flex-col rounded-card border border-border bg-surface p-5 shadow-soft transition duration-300 hover:border-border-strong ${
        archived ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--habit)/12 text-xl" aria-hidden="true">
              {habit.emoji ?? "✅"}
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-semibold" title={habit.name}>
                {habit.name}
              </h3>
              <p className="text-xs text-muted">
                {archived ? "Archived" : target === 7 ? "Every day" : `${target} days a week`}
              </p>
            </div>
          </div>
        </div>

        {!archived ? (
          <button
            type="button"
            onClick={() => onToggle(!doneToday)}
            aria-pressed={doneToday}
            aria-label={`${habit.name}: ${doneToday ? "done today, tap to undo" : "mark as done for today"}`}
            className={`flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-(--habit) transition duration-300 ease-(--ease-soft) active:scale-90 ${
              doneToday
                ? "animate-pop bg-(--habit) text-bg shadow-[0_0_24px_-6px_var(--habit)]"
                : "bg-transparent text-(--habit) hover:bg-(--habit)/10"
            }`}
          >
            <CheckIcon className={`size-7 transition duration-300 ${doneToday ? "scale-100 opacity-100" : "scale-75 opacity-30"}`} strokeWidth={2.75} />
          </button>
        ) : null}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface-2 px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <FlameIcon className="size-3.5 text-(--habit)" /> Current streak
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums">{days(stats.current)}</dd>
        </div>
        <div className="rounded-xl bg-surface-2 px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <TrophyIcon className="size-3.5 text-(--habit)" /> Best streak
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums">{days(stats.best)}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <div className="mb-2 flex items-baseline justify-between text-xs text-muted">
          <span>Last 30 days</span>
          <span className="tabular-nums">{doneCount}/30</span>
        </div>
        <div
          role="img"
          aria-label={`Done on ${doneCount} of the last 30 days`}
          className="grid grid-cols-15 gap-1"
        >
          {stats.grid.map((day) => (
            <span
              key={day.date}
              title={`${formatDate(day.date, { month: "short", day: "numeric" })}: ${day.done ? "done" : "not done"}`}
              className={`aspect-square rounded-[4px] transition-colors duration-300 ${
                day.done ? "bg-(--habit)" : "bg-surface-2"
              } ${day.date === today ? "ring-1 ring-fg/40 ring-offset-1 ring-offset-surface" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1 border-t border-border pt-3">
        {archived ? (
          <CardAction label={`Restore ${habit.name}`} onClick={() => onArchive(false)}>
            <RestoreIcon /> <span>Restore</span>
          </CardAction>
        ) : (
          <>
            <CardAction label={`Edit ${habit.name}`} onClick={onEdit}>
              <PencilIcon /> <span className="sr-only sm:not-sr-only">Edit</span>
            </CardAction>
            <CardAction label={`Archive ${habit.name}`} onClick={() => onArchive(true)}>
              <ArchiveIcon /> <span className="sr-only sm:not-sr-only">Archive</span>
            </CardAction>
          </>
        )}
        <CardAction label={`Delete ${habit.name}`} onClick={onDelete} danger>
          <TrashIcon /> <span className="sr-only sm:not-sr-only">Delete</span>
        </CardAction>
      </div>
    </article>
  );
}

function CardAction({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-muted transition hover:bg-surface-2 ${
        danger ? "hover:text-danger" : "hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
