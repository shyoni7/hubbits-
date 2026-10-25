"use client";

import { HabitCard } from "@/components/habits/habit-card";
import { StatsBar } from "@/components/habits/stats-bar";
import { addDays } from "@/lib/dates";
import { currentStreak } from "@/lib/streaks";
import type { HabitWithLogs } from "@/lib/types";

// A fixed date keeps the preview identical on the server and in the browser.
const TODAY = "2026-03-18";

function sample(id: string, name: string, emoji: string, color: string, target: number, skip: number[]): HabitWithLogs {
  const doneDates = Array.from({ length: 40 }, (_, i) => i)
    .filter((i) => !skip.includes(i))
    .map((i) => addDays(TODAY, -i));
  return {
    id,
    user_id: "preview",
    name,
    emoji,
    color,
    target_per_week: target,
    archived: false,
    created_at: null,
    doneDates,
  };
}

const habits = [
  sample("1", "Drink 2L of water", "💧", "sky", 7, [5, 12, 13, 26]),
  sample("2", "Read 10 pages", "📚", "violet", 5, [0, 3, 8, 9, 15, 21, 22, 29]),
  sample("3", "Morning run", "🏃", "mint", 3, [1, 2, 4, 6, 7, 10, 11, 14, 16, 17, 20, 23, 24, 27, 28]),
];

const noop = () => {};

/** A non-interactive picture of the dashboard for the landing page. */
export function AppPreview() {
  return (
    <div inert className="pointer-events-none select-none">
      <StatsBar
        doneToday={habits.filter((h) => h.doneDates.includes(TODAY)).length}
        activeCount={habits.length}
        weekly={82}
        longestStreak={Math.max(...habits.map((h) => currentStreak(h.doneDates, TODAY)))}
      />
      <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit, i) => (
          <li key={habit.id} className={i === 2 ? "hidden lg:block" : i === 1 ? "hidden md:block" : ""}>
            <HabitCard habit={habit} today={TODAY} onToggle={noop} onEdit={noop} onArchive={noop} onDelete={noop} />
          </li>
        ))}
      </ul>
    </div>
  );
}
