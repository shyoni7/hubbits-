import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SetupNotice } from "@/components/setup-notice";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

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

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Hello, {user.email}</h1>
      <p className="mt-2 text-muted">Your habits will live here.</p>
    </main>
  );
}
