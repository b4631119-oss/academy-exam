import "server-only"
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

// Server-only admin client.
// Uses SUPABASE_SERVICE_ROLE_KEY (server env only — NEVER expose via NEXT_PUBLIC_,
// never import this module from client components).
// Bypasses RLS: call it ONLY after the calling Server Action has already
// verified identity (studentToken / Supabase Auth) and ownership.
let cachedAdminClient: SupabaseClient | null = null

export function createAdminClient(): SupabaseClient {
  console.error("[ENV RUNTIME CHECK]", {
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    nodeEnv: process.env.NODE_ENV
  })

  if (cachedAdminClient) return cachedAdminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || ""
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "CRITICAL CONFIG ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for the admin client."
    )
  }

  cachedAdminClient = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })

  return cachedAdminClient
}
