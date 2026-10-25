// Pure streak and progress calculations. Dates are "YYYY-MM-DD" strings.
import { addDays, dayOfWeek } from "@/lib/dates";

/**
 * Consecutive checked days ending today. If today is not checked yet the
 * count starts from yesterday, so an open today never breaks the streak.
 */
export function currentStreak(doneDates: Iterable<string>, today: string): number {
  const done = new Set(doneDates);
  let day = done.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (done.has(day)) {
    count++;
    day = addDays(day, -1);
  }
  return count;
}

/** The longest run of consecutive checked days ever. */
export function bestStreak(doneDates: Iterable<string>): number {
  const sorted = [...new Set(doneDates)].sort();
  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const date of sorted) {
    run = previous !== null && addDays(previous, 1) === date ? run + 1 : 1;
    best = Math.max(best, run);
    previous = date;
  }
  return best;
}

export type HistoryDay = { date: string; done: boolean };

/** The last `days` days, oldest first, ending today. */
export function history(doneDates: Iterable<string>, today: string, days = 30): HistoryDay[] {
  const done = new Set(doneDates);
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(today, i - (days - 1));
    return { date, done: done.has(date) };
  });
}

/** The Sunday that starts the week containing `date`. */
export function startOfWeek(date: string): string {
  return addDays(date, -dayOfWeek(date));
}

/**
 * Weekly completion in percent (0 to 100). Each habit counts its check-ins
 * from Sunday to today, capped at its weekly target.
 */
export function weeklyCompletion(
  habits: { target: number; doneDates: Iterable<string> }[],
  today: string,
): number {
  const weekStart = startOfWeek(today);
  let goal = 0;
  let achieved = 0;
  for (const habit of habits) {
    const target = Math.min(Math.max(Math.round(habit.target), 1), 7);
    let count = 0;
    for (const date of new Set(habit.doneDates)) {
      if (date >= weekStart && date <= today) count++;
    }
    goal += target;
    achieved += Math.min(count, target);
  }
  return goal === 0 ? 0 : Math.round((achieved / goal) * 100);
}

/** Streak lengths worth celebrating. */
export const STREAK_MILESTONES = [7, 30, 100, 365] as const;

export function isMilestone(streak: number): boolean {
  return (STREAK_MILESTONES as readonly number[]).includes(streak);
}
