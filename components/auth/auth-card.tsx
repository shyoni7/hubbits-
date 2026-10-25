import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-12 sm:items-center sm:py-16">
      <div className="w-full max-w-sm animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
        <div className="mt-6 rounded-card border border-border bg-surface p-6 shadow-soft">
          {children}
        </div>
      </div>
    </main>
  );
}
