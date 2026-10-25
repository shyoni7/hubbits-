import Link from "next/link";
import { AppPreview } from "@/components/landing/app-preview";
import { LogoMark } from "@/components/logo";
import { buttonStyles } from "@/components/ui/button";

const features = [
  {
    title: "One tap a day",
    body: "Check off what you did with a single tap. No forms, no friction.",
    icon: (
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Streaks that motivate",
    body: "See your current and best streak for every habit, and keep the chain going.",
    icon: (
      <path
        d="M12 3c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3.5 2-4.5.3 1.6 1.2 2.5 2 2.5-1-3 0-6 1-8z"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Your week at a glance",
    body: "A 30 day history grid and a weekly score show how you are really doing.",
    icon: (
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" />
    ),
  },
];

export default function LandingPage() {
  return (
    <>
      <main className="flex-1">
        <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-2xl rounded-full bg-accent/15 blur-3xl"
          />
          <p className="mx-auto inline-flex animate-fade-up items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            Free and private habit tracker
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl animate-fade-up text-4xl font-semibold tracking-tight text-balance [animation-delay:80ms] sm:text-6xl">
            Small daily wins, <span className="text-accent">calmly tracked.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-muted text-pretty [animation-delay:160ms] sm:text-lg">
            HabitFlow helps you build habits that stick. Check off your day,
            protect your streaks and see your progress without the noise.
          </p>
          <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:240ms] sm:flex-row">
            <Link href="/signup" className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}>
              Start for free
            </Link>
            <Link
              href="/login"
              className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full sm:w-auto" })}
            >
              I already have an account
            </Link>
          </div>
        </section>

        <section aria-labelledby="preview-title" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 id="preview-title" className="sr-only">
            What the app looks like
          </h2>
          <figure className="animate-fade-up rounded-[1.75rem] border border-border bg-surface/60 p-2 shadow-soft [animation-delay:320ms] sm:p-3">
            <div className="flex items-center gap-1.5 px-3 pt-2 pb-3" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
            </div>
            <div className="rounded-card bg-bg p-4 sm:p-6">
              <AppPreview />
            </div>
            <figcaption className="sr-only">
              The HabitFlow dashboard: a daily progress ring, weekly completion, and a card for each habit with
              its streaks and a 30 day history grid.
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="features-title" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <h2 id="features-title" className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted">
            A focused tool for one job: helping you show up a little every day.
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="rounded-card border border-border bg-surface p-6 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-border-strong"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
                    {feature.icon}
                  </svg>
                </span>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.body}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-surface px-6 py-14 text-center shadow-soft">
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your first streak starts today</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">It takes less than a minute to set up your first habit.</p>
            <Link href="/signup" className={buttonStyles({ size: "lg", className: "mt-8" })}>
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <LogoMark className="size-5" />
            <span>HabitFlow</span>
          </div>
          <nav aria-label="Footer" className="flex gap-5">
            <Link href="/signup" className="hover:text-fg">Sign up</Link>
            <Link href="/login" className="hover:text-fg">Log in</Link>
            <Link href="/dashboard" className="hover:text-fg">Dashboard</Link>
          </nav>
          <p>Built with Next.js and Supabase.</p>
        </div>
      </footer>
    </>
  );
}
