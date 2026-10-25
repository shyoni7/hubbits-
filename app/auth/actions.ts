"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  status?: "error" | "check-email";
  message?: string;
  fieldErrors?: { email?: string; password?: string };
  email?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email first. Check your inbox for the link.";
  if (m.includes("already registered")) return "An account with this email already exists. Try logging in.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("password")) return message;
  return "Something went wrong. Please try again.";
}

const notConfigured: AuthFormState = {
  status: "error",
  message: "The app is not connected to Supabase yet.",
};

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) return notConfigured;
  const { email, password } = readCredentials(formData);

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (password.length < MIN_PASSWORD)
    fieldErrors.password = `Use at least ${MIN_PASSWORD} characters.`;
  if (password.length > 72) fieldErrors.password = "Use 72 characters or fewer.";
  if (fieldErrors.email || fieldErrors.password) return { status: "error", fieldErrors, email };

  // The confirmation link returns to the site the user signed up on.
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: origin ? { emailRedirectTo: `${origin}/auth/callback?next=/dashboard` } : undefined,
  });

  if (error) return { status: "error", message: friendlyError(error.message), email };

  // No session means Supabase requires email confirmation.
  if (!data.session) return { status: "check-email", email };

  redirect("/dashboard");
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) return notConfigured;
  const { email, password } = readCredentials(formData);

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!password) fieldErrors.password = "Enter your password.";
  if (fieldErrors.email || fieldErrors.password) return { status: "error", fieldErrors, email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", message: friendlyError(error.message), email };

  redirect("/dashboard");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
