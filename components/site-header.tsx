import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { buttonStyles } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <Suspense fallback={<div className="h-9 w-36 animate-pulse rounded-full bg-surface-2" aria-hidden="true" />}>
          <UserNav />
        </Suspense>
      </div>
    </header>
  );
}

async function UserNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <nav aria-label="Account" className="flex items-center gap-1 sm:gap-2">
        <Link href="/login" className={buttonStyles({ variant: "ghost", size: "sm" })}>
          Log in
        </Link>
        <Link href="/signup" className={buttonStyles({ size: "sm" })}>
          Sign up
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="Account" className="flex min-w-0 items-center gap-1 sm:gap-2">
      <span className="hidden max-w-48 truncate text-sm text-muted sm:inline" title={user.email}>
        {user.email}
      </span>
      <Link href="/dashboard" className={buttonStyles({ variant: "ghost", size: "sm" })}>
        Dashboard
      </Link>
      <form action={signOut}>
        <button type="submit" className={buttonStyles({ variant: "secondary", size: "sm" })}>
          Log out
        </button>
      </form>
    </nav>
  );
}
