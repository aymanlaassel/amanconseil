'use server';

import { headers } from 'next/headers';
import { contactSchema } from '@/lib/validation';
import { getServiceClient } from '@/lib/supabase/server';
import { verifyTurnstile } from '@/lib/turnstile';
import { notifyContact } from '@/lib/notify';

export type FormActionResult =
  | { ok: true }
  | { ok: false; error: 'invalid' | 'spam' | 'captcha' | 'server' };

export async function submitContact(input: unknown): Promise<FormActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid' };
  const d = parsed.data;
  if (d.honeypot) return { ok: false, error: 'spam' };

  const hdrs = await headers();
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (!(await verifyTurnstile(d.turnstileToken, ip))) return { ok: false, error: 'captcha' };

  try {
    const supabase = getServiceClient();
    const { error } = await supabase.from('messages_contact').insert({
      nom: d.nom,
      contact: d.contact,
      message: d.message ?? null,
      locale: d.locale,
      consent_at: new Date().toISOString(),
    });
    if (error) throw error;
  } catch (err) {
    console.error('[contact] persistence failed:', err);
    return { ok: false, error: 'server' };
  }

  void notifyContact({ nom: d.nom, contact: d.contact, message: d.message, locale: d.locale });
  return { ok: true };
}
