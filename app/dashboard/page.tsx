import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HabitBoard } from "@/components/habits/habit-board";
import { SetupNotice } from "@/components/setup-notice";
import { TimeZoneSync } from "@/components/time-zone-sync";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { getHabitsWithLogs, getUserToday, TIME_ZONE_COOKIE } from "@/lib/habits";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="flex flex-1 items-center px-4 py-12">
        <SetupNotice />
      </main>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [habits, today, cookieStore] = await Promise.all([
    getHabitsWithLogs(user.id),
    getUserToday(),
    cookies(),
  ]);
  const tz = cookieStore.get(TIME_ZONE_COOKIE)?.value;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <TimeZoneSync current={tz ? decodeURIComponent(tz) : undefined} />
      <HabitBoard habits={habits} today={today} />
    </main>
  );
}
