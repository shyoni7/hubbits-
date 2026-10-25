"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthFormState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

type Mode = "login" | "signup";

const copy = {
  login: {
    submit: "Log in",
    pending: "Logging in...",
    switchText: "New to HabitFlow?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
  signup: {
    submit: "Create account",
    pending: "Creating account...",
    switchText: "Already have an account?",
    switchLink: "Log in",
    switchHref: "/login",
  },
} as const;

export function AuthForm({ mode }: { mode: Mode }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    mode === "login" ? signIn : signUp,
    {},
  );
  const text = copy[mode];

  if (state.status === "check-email") {
    return (
      <div role="status" className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="mt-4 text-lg font-semibold">Check your inbox</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We sent a confirmation link to <span className="text-fg">{state.email}</span>.
          Open it to activate your account and you will land on your dashboard.
        </p>
        <p className="mt-6 text-sm text-muted">
          Already confirmed?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={state.email}
        error={state.fieldErrors?.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        required
        minLength={mode === "signup" ? 8 : undefined}
        hint={mode === "signup" ? "At least 8 characters." : undefined}
        error={state.fieldErrors?.password}
      />

      <p aria-live="polite" className="min-h-5 text-sm text-danger">
        {state.status === "error" ? state.message : null}
      </p>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? text.pending : text.submit}
      </Button>

      <p className="text-center text-sm text-muted">
        {text.switchText}{" "}
        <Link href={text.switchHref} className="font-medium text-accent hover:underline">
          {text.switchLink}
        </Link>
      </p>
    </form>
  );
}
