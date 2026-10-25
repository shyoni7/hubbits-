"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonStyles } from "@/components/ui/button";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md animate-fade-up text-center">
        <p className="text-sm font-medium text-danger">Something went wrong</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">We hit a snag loading this page</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Your habits are safe. Try again, and if it keeps happening, check your connection or come back in a minute.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Button onClick={() => retry()}>Try again</Button>
          <Link href="/" className={buttonStyles({ variant: "secondary" })}>
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
