"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Stores the browser's time zone in a cookie so the server knows the user's
 * "today", then refreshes once if it changed.
 */
export function TimeZoneSync({ current }: { current?: string }) {
  const router = useRouter();

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz || tz === current) return;
    document.cookie = `tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }, [current, router]);

  return null;
}
