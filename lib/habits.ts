import "server-only";
import { cookies } from "next/headers";
import { todayIn } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import type { Habit, HabitWithLogs } from "@/lib/types";

export const TIME_ZONE_COOKIE = "tz";

/** Today's date in the user's time zone, from the cookie set by the browser. */
export async function getUserToday() {
  const tz = (await cookies()).get(TIME_ZONE_COOKIE)?.value;
  return todayIn(tz ? decodeURIComponent(tz) : undefined);
}

const PAGE_SIZE = 1000;

/** All of the user's habits with their check-in dates. RLS limits rows to the owner. */
export async function getHabitsWithLogs(userId: string): Promise<HabitWithLogs[]> {
  const supabase = await createClient();

  const habitsQuery = supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  // Supabase returns at most 1000 rows per request, so page through the logs.
  async function allLogs() {
    const rows: { habit_id: string; done_on: string }[] = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabase
        .from("habit_logs")
        .select("habit_id, done_on")
        .eq("user_id", userId)
        .order("done_on", { ascending: true })
        .order("id", { ascending: true })
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw new Error(`Could not load check-ins: ${error.message}`);
      rows.push(...data);
      if (data.length < PAGE_SIZE) return rows;
    }
  }

  const [{ data: habits, error }, logs] = await Promise.all([habitsQuery, allLogs()]);
  if (error) throw new Error(`Could not load habits: ${error.message}`);

  const datesByHabit = new Map<string, string[]>();
  for (const log of logs) {
    const list = datesByHabit.get(log.habit_id) ?? [];
    list.push(log.done_on);
    datesByHabit.set(log.habit_id, list);
  }

  return (habits as Habit[]).map((habit) => ({
    ...habit,
    doneDates: datesByHabit.get(habit.id) ?? [],
  }));
}
