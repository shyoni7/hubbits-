export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6" aria-busy="true">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-surface-2" />
      <div className="mt-3 h-4 w-40 animate-pulse rounded bg-surface-2" />
      <span className="sr-only">Loading your dashboard</span>
    </main>
  );
}
