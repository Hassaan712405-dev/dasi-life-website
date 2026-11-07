import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Public Supabase client — NO cookies, static-safe.
 * 
 * Use this for PUBLIC data that is the same for all users:
 * - Products
 * - Categories
 * - Reviews
 * - CMS content
 * 
 * DO NOT use for user-specific data (cart, orders, account).
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}