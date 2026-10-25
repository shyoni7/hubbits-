function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10" aria-busy="true">
      <span className="sr-only" role="status">
        Loading your habits
      </span>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Block className="h-4 w-40" />
          <Block className="mt-2 h-8 w-28" />
        </div>
        <Block className="h-11 w-full rounded-full sm:w-36" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-card border border-border bg-surface p-4">
            <Block className="h-full w-full" />
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-card border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <Block className="size-10 rounded-xl" />
              <div className="flex-1">
                <Block className="h-4 w-32" />
                <Block className="mt-2 h-3 w-20" />
              </div>
              <Block className="size-14 rounded-full" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Block className="h-16 rounded-xl" />
              <Block className="h-16 rounded-xl" />
            </div>
            <Block className="mt-4 h-10 w-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
