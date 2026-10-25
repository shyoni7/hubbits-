"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { addDays, isDateString } from "@/lib/dates";
import { HABIT_COLORS, HABIT_EMOJIS, NAME_MAX_LENGTH } from "@/lib/habit-options";
import { getUserToday } from "@/lib/habits";
import { createClient } from "@/lib/supabase/server";
import type { HabitInsert } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export type HabitFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: { name?: string; emoji?: string; color?: string; target?: string };
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SIGNED_OUT = "Your session has ended. Please log in again.";
const GENERIC = "Something went wrong. Please try again.";

async function requireUser() {
  const user = await getCurrentUser();
  return user ? { user, supabase: await createClient() } : null;
}

function parseHabitForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
  const emoji = String(formData.get("emoji") ?? "");
  const color = String(formData.get("color") ?? "");
  const target = Number(formData.get("target_per_week"));

  const fieldErrors: HabitFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Give your habit a name.";
  else if (name.length > NAME_MAX_LENGTH)
    fieldErrors.name = `Keep it under ${NAME_MAX_LENGTH} characters.`;
  if (!(HABIT_EMOJIS as readonly string[]).includes(emoji)) fieldErrors.emoji = "Pick an emoji.";
  if (!HABIT_COLORS.some((c) => c.key === color)) fieldErrors.color = "Pick a color.";
  if (!Number.isInteger(target) || target < 1 || target > 7)
    fieldErrors.target = "Choose between 1 and 7 days.";

  const values: HabitInsert = { name, emoji, color, target_per_week: target };
  return { values, fieldErrors };
}

/** Creates a habit, or updates it when the form has an id. */
export async function saveHabit(_prev: HabitFormState, formData: FormData): Promise<HabitFormState> {
  const session = await requireUser();
  if (!session) return { error: SIGNED_OUT };

  const id = String(formData.get("id") ?? "");
  if (id && !UUID_RE.test(id)) return { error: GENERIC };

  const { values, fieldErrors } = parseHabitForm(formData);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const { supabase, user } = session;
  const { error } = id
    ? await supabase.from("habits").update(values).eq("id", id).eq("user_id", user.id)
    : await supabase.from("habits").insert(values);

  if (error) return { error: GENERIC };
  refresh();
  return { ok: true };
}

export async function setHabitArchived(id: string, archived: boolean): Promise<ActionResult> {
  const session = await requireUser();
  if (!session) return { ok: false, error: SIGNED_OUT };
  if (!UUID_RE.test(id) || typeof archived !== "boolean") return { ok: false, error: GENERIC };

  const { error } = await session.supabase
    .from("habits")
    .update({ archived })
    .eq("id", id)
    .eq("user_id", session.user.id);
  if (error) return { ok: false, error: GENERIC };
  refresh();
  return { ok: true };
}

export async function deleteHabit(id: string): Promise<ActionResult> {
  const session = await requireUser();
  if (!session) return { ok: false, error: SIGNED_OUT };
  if (!UUID_RE.test(id)) return { ok: false, error: GENERIC };

  const { error } = await session.supabase
    .from("habits")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);
  if (error) return { ok: false, error: GENERIC };
  refresh();
  return { ok: true };
}

/** Marks a habit as done or not done on a date (today, in the user's time zone). */
export async function setHabitDone(habitId: string, date: string, done: boolean): Promise<ActionResult> {
  const session = await requireUser();
  if (!session) return { ok: false, error: SIGNED_OUT };
  if (!UUID_RE.test(habitId) || !isDateString(date) || typeof done !== "boolean") {
    return { ok: false, error: GENERIC };
  }

  // Allow a day of slack either way for time zone changes, but no far past or future dates.
  const today = await getUserToday();
  if (date > addDays(today, 1) || date < addDays(today, -30)) {
    return { ok: false, error: "That day can no longer be changed." };
  }

  const { supabase, user } = session;
  const { error } = done
    ? await supabase
        .from("habit_logs")
        .upsert({ habit_id: habitId, done_on: date }, { onConflict: "habit_id,done_on", ignoreDuplicates: true })
    : await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habitId)
        .eq("done_on", date)
        .eq("user_id", user.id);

  if (error) return { ok: false, error: "Could not save. Your change was undone." };
  refresh();
  return { ok: true };
}
