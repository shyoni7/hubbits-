import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { LoginNotice } from "@/components/auth/login-notice";
import { SetupNotice } from "@/components/setup-notice";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="flex flex-1 items-center px-4 py-12">
        <SetupNotice />
      </main>
    );
  }
  return (
    <AuthCard title="Welcome back" subtitle="Log in to keep your streaks going.">
      <Suspense>
        <LoginNotice />
      </Suspense>
      <AuthForm mode="login" />
    </AuthCard>
  );
}
