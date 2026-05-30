'use server';

import { headers } from 'next/headers';
import { providerSchema } from '@/lib/validation';
import { getServiceClient } from '@/lib/supabase/server';
import { verifyTurnstile } from '@/lib/turnstile';
import { notifyProvider } from '@/lib/notify';
import type { FormActionResult } from './contact';

export async function submitProvider(input: unknown): Promise<FormActionResult> {
  const parsed = providerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid' };
  const d = parsed.data;
  if (d.honeypot) return { ok: false, error: 'spam' };

  const hdrs = await headers();
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (!(await verifyTurnstile(d.turnstileToken, ip))) return { ok: false, error: 'captcha' };

  try {
    const supabase = getServiceClient();
    const { error } = await supabase.from('prestataires').insert({
      nom: d.nom,
      metier: d.metier,
      ville: d.ville ?? null,
      telephone: d.telephone,
      email: d.email ?? null,
      message: d.message ?? null,
      locale: d.locale,
      consent_at: new Date().toISOString(),
    });
    if (error) throw error;
  } catch (err) {
    console.error('[provider] persistence failed:', err);
    return { ok: false, error: 'server' };
  }

  void notifyProvider({
    nom: d.nom,
    metier: d.metier,
    ville: d.ville,
    telephone: d.telephone,
    email: d.email,
    message: d.message,
    locale: d.locale,
  });
  return { ok: true };
}
