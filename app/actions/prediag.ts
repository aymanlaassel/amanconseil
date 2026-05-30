'use server';

import { headers } from 'next/headers';
import { prediagnosticSchema } from '@/lib/validation';
import { QUESTIONS } from '@/lib/prediag.data';
import { computeResult, type PrediagResult } from '@/lib/prediag';
import { getServiceClient } from '@/lib/supabase/server';
import { verifyTurnstile } from '@/lib/turnstile';
import { notifyPrediagnostic } from '@/lib/notify';
import type { Locale } from '@/i18n/routing';

export type PrediagActionResult =
  | { ok: true; result: PrediagResult }
  | { ok: false; error: 'invalid' | 'spam' | 'captcha' };

export async function submitPrediagnostic(input: unknown): Promise<PrediagActionResult> {
  const parsed = prediagnosticSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid' };
  const data = parsed.data;

  // Honeypot — a real user never fills this.
  if (data.honeypot) return { ok: false, error: 'spam' };

  // Anti-bot.
  const hdrs = await headers();
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim();
  const human = await verifyTurnstile(data.turnstileToken, ip);
  if (!human) return { ok: false, error: 'captcha' };

  const questions = QUESTIONS[data.locale as Locale] ?? QUESTIONS.fr;
  if (data.answers.length !== questions.length) return { ok: false, error: 'invalid' };

  // Verdict is computed on the server — the client value is never trusted.
  const result = computeResult(questions, data.answers);

  // Persist the lead + answers + verdict. Best-effort: a storage failure is
  // logged but must not deny the visitor their verdict.
  try {
    const supabase = getServiceClient();
    const { data: lead, error: leadErr } = await supabase
      .from('leads')
      .insert({
        nom: data.nom,
        telephone: data.telephone,
        email: data.email ?? null,
        source: 'prediagnostic',
        locale: data.locale,
        consent_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    if (leadErr || !lead) throw leadErr ?? new Error('lead insert returned no row');

    const { error: pdErr } = await supabase.from('prediagnostics').insert({
      lead_id: lead.id,
      reponses: data.answers,
      score: result.score,
      verdict: result.verdict,
    });
    if (pdErr) throw pdErr;
  } catch (err) {
    console.error('[prediag] persistence failed:', err);
  }

  // Notify the team (non-blocking).
  void notifyPrediagnostic({
    nom: data.nom,
    telephone: data.telephone,
    email: data.email,
    locale: data.locale,
    result,
  });

  return { ok: true, result };
}
