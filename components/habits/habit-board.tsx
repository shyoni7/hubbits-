"use client";

import { useCallback, useOptimistic, useState, useTransition } from "react";
import { deleteHabit, setHabitArchived, setHabitDone, type ActionResult } from "@/app/dashboard/actions";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitDialog } from "@/components/habits/habit-dialog";
import { StatsBar } from "@/components/habits/stats-bar";
import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/dates";
import { currentStreak, weeklyCompletion } from "@/lib/streaks";
import type { Habit, HabitWithLogs } from "@/lib/types";

type OptimisticChange =
  | { type: "done"; id: string; date: string; done: boolean }
  | { type: "archived"; id: string; archived: boolean }
  | { type: "deleted"; id: string };

function applyChange(habits: HabitWithLogs[], change: OptimisticChange): HabitWithLogs[] {
  if (change.type === "deleted") return habits.filter((h) => h.id !== change.id);
  return habits.map((h) => {
    if (h.id !== change.id) return h;
    if (change.type === "archived") return { ...h, archived: change.archived };
    const without = h.doneDates.filter((d) => d !== change.date);
    return { ...h, doneDates: change.done ? [...without, change.date] : without };
  });
}

export function HabitBoard({ habits, today }: { habits: HabitWithLogs[]; today: string }) {
  const [optimisticHabits, addOptimistic] = useOptimistic(habits, applyChange);
  const [, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ key: number; habit?: Habit } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Habit | null>(null);
  const [showArchive, setShowArchive] = useState(false);

  const active = optimisticHabits.filter((h) => !h.archived);
  const archived = optimisticHabits.filter((h) => h.archived);
  const weekly = weeklyCompletion(
    active.map((h) => ({ target: h.target_per_week ?? 7, doneDates: h.doneDates })),
    today,
  );

  const dismissToast = useCallback(() => setToast(null), []);
  const closeEditor = useCallback(() => setEditor(null), []);
  const openEditor = (habit?: Habit) => setEditor({ key: Date.now(), habit });

  /** Show the change at once, save it, and roll back with a toast if saving fails. */
  function run(change: OptimisticChange, save: () => Promise<ActionResult>) {
    startTransition(async () => {
      addOptimistic(change);
      const result = await save();
      if (!result.ok) setToast(result.error);
    });
  }

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted">{formatDate(today, { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Today</h1>
        </div>
        <Button onClick={() => openEditor()} className="w-full sm:w-auto">
          <PlusIcon /> New habit
        </Button>
      </div>

      {active.length > 0 ? (
        <StatsBar
          doneToday={active.filter((h) => h.doneDates.includes(today)).length}
          activeCount={active.length}
          weekly={weekly}
          longestStreak={Math.max(0, ...active.map((h) => currentStreak(h.doneDates, today)))}
        />
      ) : null}

      {active.length === 0 ? (
        <EmptyState hasArchived={archived.length > 0} onCreate={() => openEditor()} />
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((habit) => (
            <li key={habit.id} className="animate-fade-up">
              <HabitCard
                habit={habit}
                today={today}
                onToggle={(done) =>
                  run({ type: "done", id: habit.id, date: today, done }, () => setHabitDone(habit.id, today, done))
                }
                onEdit={() => openEditor(habit)}
                onArchive={(value) =>
                  run({ type: "archived", id: habit.id, archived: value }, () => setHabitArchived(habit.id, value))
                }
                onDelete={() => setPendingDelete(habit)}
              />
            </li>
          ))}
        </ul>
      )}

      {archived.length > 0 ? (
        <section aria-label="Archive" className="mt-10">
          <button
            type="button"
            role="switch"
            aria-checked={showArchive}
            onClick={() => setShowArchive((v) => !v)}
            className="flex items-center gap-3 rounded-full text-sm text-muted transition hover:text-fg"
          >
            <span
              className={`relative h-6 w-10 rounded-full transition ${showArchive ? "bg-accent" : "bg-surface-2 ring-1 ring-border-strong"}`}
              aria-hidden="true"
            >
              <span
                className={`absolute top-1 left-1 size-4 rounded-full bg-fg transition-transform duration-300 ease-(--ease-soft) ${
                  showArchive ? "translate-x-4" : ""
                }`}
              />
            </span>
            Show archive ({archived.length})
          </button>

          {showArchive ? (
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {archived.map((habit) => (
                <li key={habit.id} className="animate-fade-up">
                  <HabitCard
                    habit={habit}
                    today={today}
                    onToggle={() => {}}
                    onEdit={() => openEditor(habit)}
                    onArchive={(value) =>
                      run({ type: "archived", id: habit.id, archived: value }, () => setHabitArchived(habit.id, value))
                    }
                    onDelete={() => setPendingDelete(habit)}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {editor ? <HabitDialog key={editor.key} habit={editor.habit} onClose={closeEditor} /> : null}

      {pendingDelete ? (
        <Modal
          title={`Delete "${pendingDelete.name}"?`}
          description="This removes the habit and its whole history. This cannot be undone."
          onClose={() => setPendingDelete(null)}
        >
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                const habit = pendingDelete;
                setPendingDelete(null);
                run({ type: "deleted", id: habit.id }, () => deleteHabit(habit.id));
              }}
            >
              Delete habit
            </Button>
          </div>
        </Modal>
      ) : null}

      <Toast message={toast} onDismiss={dismissToast} />
    </>
  );
}

function EmptyState({ hasArchived, onCreate }: { hasArchived: boolean; onCreate: () => void }) {
  return (
    <div className="mt-8 flex animate-fade-up flex-col items-center rounded-card border border-dashed border-border-strong bg-surface/50 px-6 py-14 text-center">
      <div className="flex gap-2 text-3xl" aria-hidden="true">
        <span className="-rotate-6">💧</span>
        <span className="-translate-y-1">📚</span>
        <span className="rotate-6">🏃</span>
      </div>
      <h2 className="mt-5 text-lg font-semibold">{hasArchived ? "No active habits" : "Start with one small habit"}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        {hasArchived
          ? "Everything is archived. Restore a habit below or create a new one."
          : "Pick something tiny you can do every day, like drinking a glass of water. You can add more later."}
      </p>
      <Button onClick={onCreate} className="mt-6">
        <PlusIcon /> Create a habit
      </Button>
    </div>
  );
}
