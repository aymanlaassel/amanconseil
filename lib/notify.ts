import 'server-only';
import { Resend } from 'resend';
import type { PrediagResult } from './prediag';

const FROM = process.env.RESEND_FROM_EMAIL ?? 'Aman Conseil <onboarding@resend.dev>';

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function notifyEmail(): string | null {
  return process.env.NOTIFY_EMAIL ?? null;
}

function esc(value: string | null | undefined): string {
  if (!value) return '—';
  return value.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!);
}

function shell(title: string, rows: Array<[string, string]>, extra = ''): string {
  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#6E747A;font-size:13px">${esc(k)}</td><td style="padding:6px 12px;font-size:14px"><b>${esc(v)}</b></td></tr>`,
    )
    .join('');
  return `<div style="font-family:system-ui,sans-serif;max-width:560px">
    <div style="background:#0E1116;color:#fff;padding:18px 20px;border-radius:8px 8px 0 0">
      <span style="font-weight:800;font-size:18px">aman<span style="color:#0FA86A">.</span>conseil</span>
      <div style="color:#9aa1a8;font-size:13px;margin-top:4px">${esc(title)}</div>
    </div>
    <div style="border:1px solid #E1E3DC;border-top:none;border-radius:0 0 8px 8px;padding:8px 8px 16px">
      <table style="width:100%;border-collapse:collapse">${trs}</table>
      ${extra}
    </div>
  </div>`;
}

/** Best-effort send. Never throws — notification failures must not block leads. */
async function send(subject: string, html: string): Promise<void> {
  const resend = client();
  const to = notifyEmail();
  if (!resend || !to) {
    console.warn('[notify] Resend not configured — skipping email:', subject);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error('[notify] email failed:', err);
  }
}

const VERDICT_LABEL: Record<string, string> = {
  vert: '🟢 Bon signe',
  orange: '🟠 À sécuriser',
  rouge: '🔴 Risque élevé',
};

export async function notifyPrediagnostic(input: {
  nom: string;
  telephone: string;
  email?: string;
  locale: string;
  result: PrediagResult;
}): Promise<void> {
  const { result } = input;
  const recos = result.recommendations.length
    ? `<div style="padding:8px 12px"><div style="color:#6E747A;font-size:13px;margin-bottom:6px">Recommandations</div><ul style="margin:0;padding-left:18px;font-size:13px">${result.recommendations
        .map((r) => `<li>${esc(r.t)}</li>`)
        .join('')}</ul></div>`
    : '';
  const html = shell(
    'Nouveau pré-diagnostic',
    [
      ['Nom', input.nom],
      ['Téléphone', input.telephone],
      ['Email', input.email ?? '—'],
      ['Langue', input.locale],
      ['Verdict', VERDICT_LABEL[result.verdict] ?? result.verdict],
      ['Score', `✓ ${result.score.ok} · ⚠ ${result.score.warn} · ✕ ${result.score.bad}`],
    ],
    recos,
  );
  await send(`Nouveau lead · pré-diagnostic ${VERDICT_LABEL[result.verdict] ?? ''}`, html);
}

export async function notifyContact(input: {
  nom: string;
  contact: string;
  message?: string;
  locale: string;
}): Promise<void> {
  const extra = input.message
    ? `<div style="padding:8px 12px;font-size:14px">${esc(input.message)}</div>`
    : '';
  const html = shell(
    'Nouveau message de contact',
    [
      ['Nom', input.nom],
      ['Contact', input.contact],
      ['Langue', input.locale],
    ],
    extra,
  );
  await send('Nouveau message de contact', html);
}

export async function notifyProvider(input: {
  nom: string;
  metier: string;
  ville?: string;
  telephone: string;
  email?: string;
  message?: string;
  locale: string;
}): Promise<void> {
  const extra = input.message
    ? `<div style="padding:8px 12px;font-size:14px">${esc(input.message)}</div>`
    : '';
  const html = shell(
    'Nouvelle candidature prestataire',
    [
      ['Nom / société', input.nom],
      ['Métier', input.metier],
      ['Ville', input.ville ?? '—'],
      ['Téléphone', input.telephone],
      ['Email', input.email ?? '—'],
      ['Langue', input.locale],
    ],
    extra,
  );
  await send('Nouvelle candidature prestataire', html);
}
