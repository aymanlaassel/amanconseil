import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

/** Cookie-bound Supabase client for the /admin auth session (anon key). */
export async function getSupabaseAuth(): Promise<SupabaseClient<Database> | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const cookieStore = await cookies();
  return createServerClient<Database>(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // called from a Server Component (read-only cookies) — ignore.
        }
      },
    },
  });
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export type AdminCheck =
  | { state: 'unconfigured' }
  | { state: 'anonymous' }
  | { state: 'forbidden'; email: string }
  | { state: 'ok'; email: string };

/** Resolve the current admin: configured? signed-in? allow-listed? */
export async function getAdminUser(): Promise<AdminCheck> {
  const sb = await getSupabaseAuth();
  if (!sb) return { state: 'unconfigured' };

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user?.email) return { state: 'anonymous' };

  const allowed = adminEmails();
  if (allowed.length > 0 && !allowed.includes(user.email.toLowerCase())) {
    return { state: 'forbidden', email: user.email };
  }
  return { state: 'ok', email: user.email };
}
