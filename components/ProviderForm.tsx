'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { METIERS } from '@/lib/validation';
import { submitProvider } from '@/app/actions/provider';
import { FORM_ERROR } from '@/lib/form-labels';
import { Turnstile } from './Turnstile';

// Métier enum value → message-catalog key for its localized label.
const METIER_OPTIONS: Array<{ value: (typeof METIERS)[number]; key: string }> = [
  { value: 'notaire', key: 'prest_opt_not' },
  { value: 'architecte', key: 'prest_opt_arch' },
  { value: 'geometre', key: 'prest_opt_geo' },
  { value: 'bet', key: 'prest_opt_bet' },
  { value: 'btp', key: 'prest_opt_btp' },
  { value: 'geotechnique', key: 'prest_opt_geotech' },
  { value: 'juriste', key: 'prest_opt_juriste' },
  { value: 'comptable', key: 'prest_opt_compta' },
  { value: 'banquier', key: 'prest_opt_banquier' },
  { value: 'autre', key: 'prest_opt_autre' },
];

const schema = z.object({
  nom: z.string().trim().min(2),
  metier: z.enum(METIERS),
  ville: z.string().trim().max(120).optional(),
  telephone: z.string().trim().min(6),
  email: z.union([z.string().trim().email(), z.literal('')]).optional(),
  message: z.string().trim().max(2000).optional(),
});
type Values = z.infer<typeof schema>;

export function ProviderForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  const [token, setToken] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(values: Values) {
    setErr(null);
    const res = await submitProvider({
      ...values,
      consent: true,
      locale,
      honeypot,
      turnstileToken: token,
    });
    if (res.ok) setDone(true);
    else setErr(FORM_ERROR[locale]);
  }

  if (done) {
    return (
      <div className="prest-card">
        <div className="prest-ok">
          <div className="chk">✓</div>
          <div className="big">{t.raw('prest_ok_big')}</div>
          <p>{t.raw('prest_ok_p')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prest-card">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="p-nom">{t.raw('prest_nom')}</label>
          <input id="p-nom" type="text" placeholder={t.raw('prest_nom_ph')} {...register('nom')} />
          {errors.nom && <p className="field-err">{t.raw('prest_nom')} —</p>}
        </div>
        <div className="field">
          <label htmlFor="p-metier">{t.raw('prest_metier')}</label>
          <select id="p-metier" defaultValue="" {...register('metier')}>
            <option value="" disabled>
              {t.raw('prest_opt0')}
            </option>
            {METIER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {t.raw(o.key)}
              </option>
            ))}
          </select>
          {errors.metier && <p className="field-err">{t.raw('prest_metier')} —</p>}
        </div>
        <div className="field">
          <label htmlFor="p-ville">{t.raw('prest_ville')}</label>
          <input id="p-ville" type="text" placeholder={t.raw('prest_ville_ph')} {...register('ville')} />
        </div>
        <div className="field">
          <label htmlFor="p-tel">{t.raw('prest_tel')}</label>
          <input id="p-tel" type="tel" placeholder="06 00 00 00 00" {...register('telephone')} />
          {errors.telephone && <p className="field-err">{t.raw('prest_tel')} —</p>}
        </div>
        <div className="field">
          <label htmlFor="p-mail">{t.raw('prest_mail')}</label>
          <input id="p-mail" type="email" placeholder={t.raw('prest_mail_ph')} {...register('email')} />
        </div>
        <div className="field">
          <label htmlFor="p-msg">{t.raw('prest_msg')}</label>
          <textarea id="p-msg" placeholder={t.raw('prest_msg_ph')} {...register('message')} />
        </div>

        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />

        <Turnstile onToken={setToken} />

        <p className="consent">{t.raw('prest_consent')}</p>
        {err && <p className="field-err">{err}</p>}
        <button className="pd-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '…' : t.raw('prest_btn')}
        </button>
      </form>
    </div>
  );
}
