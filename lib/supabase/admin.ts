import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client: bypasses RLS entirely. Server-only — never import
 * this from a Client Component or anywhere the bundle could reach the
 * browser. Used by the Stripe webhook, which has no user session to scope
 * a normal client to.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
