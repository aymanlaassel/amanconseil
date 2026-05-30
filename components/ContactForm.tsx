'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { submitContact } from '@/app/actions/contact';
import { CONTACT_LABELS, FORM_ERROR } from '@/lib/form-labels';
import { Turnstile } from './Turnstile';
import { Honeypot } from './Honeypot';

const schema = z.object({
  nom: z.string().trim().min(2),
  contact: z.string().trim().min(3),
  message: z.string().trim().max(2000).optional(),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const L = CONTACT_LABELS[locale];
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
    const res = await submitContact({
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
          <p>{L.ok_sub}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prest-card">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="c-nom">{L.nom}</label>
          <input id="c-nom" type="text" {...register('nom')} />
          {errors.nom && <p className="field-err">{L.nom} —</p>}
        </div>
        <div className="field">
          <label htmlFor="c-contact">{L.contact}</label>
          <input id="c-contact" type="text" placeholder={L.contact_ph} {...register('contact')} />
          {errors.contact && <p className="field-err">{L.contact} —</p>}
        </div>
        <div className="field">
          <label htmlFor="c-msg">{L.message}</label>
          <textarea id="c-msg" placeholder={L.message_ph} {...register('message')} />
        </div>

        <Honeypot value={honeypot} onChange={setHoneypot} />

        <Turnstile onToken={setToken} />

        <p className="consent">{t.raw('lead_consent')}</p>
        {err && <p className="field-err">{err}</p>}
        <button className="pd-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '…' : L.send}
        </button>
      </form>
    </div>
  );
}
