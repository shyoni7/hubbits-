import { createBrowserClient } from "@supabase/ssr";
import {
  assertSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/env";

/** Supabase client for Client Components (runs in the browser). */
export function createClient() {
  assertSupabaseConfigured();
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
