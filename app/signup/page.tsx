import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { SetupNotice } from "@/components/setup-notice";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="flex flex-1 items-center px-4 py-12">
        <SetupNotice />
      </main>
    );
  }
  return (
    <AuthCard title="Create your account" subtitle="Start building habits in under a minute.">
      <AuthForm mode="signup" />
    </AuthCard>
  );
}
