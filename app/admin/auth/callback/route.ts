import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAuth } from '@/lib/supabase/auth';

// Magic-link / OTP redirect target: exchanges the code for a session cookie.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const sb = await getSupabaseAuth();
  if (code && sb) {
    await sb.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL('/admin', req.url));
}
