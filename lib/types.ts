// TypeScript types that match supabase/migrations/001_init.sql.

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  emoji: string | null;
  color: string | null;
  target_per_week: number | null;
  archived: boolean | null;
  created_at: string | null;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  /** Calendar date as YYYY-MM-DD. */
  done_on: string;
};

/** Fields the app sends when creating a habit (id and user_id come from defaults). */
export type HabitInsert = Pick<Habit, "name"> &
  Partial<Pick<Habit, "emoji" | "color" | "target_per_week" | "archived">>;

export type HabitUpdate = Partial<HabitInsert>;

export type HabitLogInsert = Pick<HabitLog, "habit_id" | "done_on">;

/** A habit together with every date it was checked (YYYY-MM-DD). */
export type HabitWithLogs = Habit & { doneDates: string[] };
