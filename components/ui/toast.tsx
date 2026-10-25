"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";

export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      {message ? (
        <div className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-center gap-3 rounded-2xl border border-danger/40 bg-surface-2 px-4 py-3 text-sm shadow-soft">
          <span className="size-2 shrink-0 rounded-full bg-danger" aria-hidden="true" />
          <p className="flex-1">{message}</p>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full p-1 text-muted hover:text-fg"
            aria-label="Dismiss"
          >
            <CloseIcon />
          </button>
        </div>
      ) : null}
    </div>
  );
}
