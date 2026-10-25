/** Shown instead of crashing when the Supabase environment variables are missing. */
export function SetupNotice() {
  return (
    <div
      role="status"
      className="mx-auto w-full max-w-xl rounded-card border border-border bg-surface p-6 shadow-soft"
    >
      <p className="text-sm font-medium text-accent">Almost there</p>
      <h2 className="mt-1 text-lg font-semibold">Connect Supabase to continue</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        HabitFlow needs two environment variables. Add them to{" "}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 text-fg">.env.local</code>{" "}
        when running locally, or to your Vercel project settings, then restart
        or redeploy:
      </p>
      <pre className="mt-4 overflow-x-auto rounded-xl bg-bg p-4 text-xs leading-relaxed text-fg">
        {`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...`}
      </pre>
      <p className="mt-3 text-xs text-muted">
        Find both in Supabase under Project Settings, API Keys. See README.md for
        the full setup.
      </p>
    </div>
  );
}
