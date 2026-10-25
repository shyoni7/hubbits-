import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md animate-fade-up text-center">
        <p className="text-6xl font-semibold tracking-tight text-accent tabular-nums">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">This page took a day off</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The link may be broken or the page may have moved.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/" className={buttonStyles()}>
            Go home
          </Link>
          <Link href="/dashboard" className={buttonStyles({ variant: "secondary" })}>
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
