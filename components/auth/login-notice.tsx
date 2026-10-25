"use client";

import { useSearchParams } from "next/navigation";

const notices: Record<string, string> = {
  "link-failed":
    "We could not sign you in from that link. If you just confirmed your email, log in below.",
};

export function LoginNotice() {
  const notice = notices[useSearchParams().get("notice") ?? ""];
  if (!notice) return null;
  return (
    <p role="status" className="mb-4 rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
      {notice}
    </p>
  );
}
