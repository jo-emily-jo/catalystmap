import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/**
 * Public (anon) client for SSR reads.
 * Safe for server components — uses the anon key which respects RLS.
 */
export function getPublicClient(): SupabaseClient {
  return createClient(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

/**
 * Service role client for server-only writes (seed script, admin routes).
 * Bypasses RLS. NEVER expose this client-side.
 */
export function getServerClient(): SupabaseClient {
  return createClient(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar("SUPABASE_SERVICE_ROLE_KEY")
  );
}
