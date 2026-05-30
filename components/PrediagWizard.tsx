'use client';

import { useCallback, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { QUESTIONS } from '@/lib/prediag.data';
import { VERDICT_KEYS, type PrediagResult } from '@/lib/prediag';
import type { Locale } from '@/i18n/routing';
import { submitPrediagnostic } from '@/app/actions/prediag';
import { Link } from '@/i18n/navigation';
import { Html } from './Html';
import { Turnstile } from './Turnstile';

type Screen = 'intro' | 'q' | 'lead' | 'result';

export function PrediagWizard() {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const questions = useMemo(() => QUESTIONS[locale] ?? QUESTIONS.fr, [locale]);

  const [screen, setScreen] = useState<Screen>('intro');
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(questions.length).fill(-1));
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [mail, setMail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [token, setToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PrediagResult | null>(null);

  const onToken = useCallback((value: string) => setToken(value), []);

  const progress =
    screen === 'q' ? Math.round((cur / questions.length) * 100) : screen === 'intro' ? 0 : 100;

  function choose(optIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[cur] = optIndex;
      return next;
    });
    window.setTimeout(() => {
      if (cur < questions.length - 1) setCur((c) => c + 1);
      else setScreen('lead');
    }, 230);
  }

  function back() {
    if (cur > 0) setCur((c) => c - 1);
  }

  function start() {
    setCur(0);
    setAnswers(Array(questions.length).fill(-1));
    setScreen('q');
  }

  function restart() {
    setCur(0);
    setAnswers(Array(questions.length).fill(-1));
    setNom('');
    setTel('');
    setMail('');
    setToken('');
    setError(null);
    setResult(null);
    setScreen('intro');
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitPrediagnostic({
        nom,
        telephone: tel,
        email: mail || undefined,
        consent: true,
        locale,
        answers,
        honeypot,
        turnstileToken: token,
      });
      if (res.ok) {
        setResult(res.result);
        setScreen('result');
      } else {
        setError(res.error);
      }
    } catch {
      setError('server');
    } finally {
      setSubmitting(false);
    }
  }

  const leadReady = nom.trim().length > 0 && tel.trim().length > 0;
  const question = questions[cur];

  return (
    <div className="pd-shell">
      <div className="pd-bar">
        <span className="b">
          aman<span className="c">.</span>conseil
        </span>
        <span className="ar">أمان</span>
      </div>
      <div className="pd-prog">
        <div className="fill" style={{ width: `${progress}%` }} />
      </div>

      {/* INTRO */}
      {screen === 'intro' && (
        <div className="pd-screen">
          <span className="pd-kick">{t.raw('pd_kick')}</span>
          <h3 className="pd-h">{t.raw('pd_introh')}</h3>
          <p className="pd-sub">{t.raw('pd_introsub')}</p>
          <ul className="pd-feat">
            <li>
              <Html html={t.raw('pd_f1')} />
            </li>
            <li>
              <Html html={t.raw('pd_f2')} />
            </li>
            <li>
              <Html html={t.raw('pd_f3')} />
            </li>
          </ul>
          <button className="pd-btn" type="button" onClick={start}>
            {t.raw('pd_start')}
          </button>
        </div>
      )}

      {/* QUESTIONS */}
      {screen === 'q' && question && (
        <div className="pd-screen">
          <span className="qcount">
            {t.raw('qcount_word')} {cur + 1} / {questions.length}
          </span>
          <div className="q">{question.q}</div>
          <div className="qhint">{question.hint}</div>
          <div>
            {question.opts.map((o, i) => (
              <button
                key={i}
                type="button"
                className={`opt${answers[cur] === i ? ' sel' : ''}`}
                onClick={() => choose(i)}
              >
                <span className="tick" />
                <span>{o.t}</span>
              </button>
            ))}
          </div>
          <div className="pd-nav">
            <button
              className="pd-back"
              type="button"
              onClick={back}
              style={{ visibility: cur === 0 ? 'hidden' : 'visible' }}
              aria-label="←"
            >
              ←
            </button>
          </div>
        </div>
      )}

      {/* LEAD CAPTURE */}
      {screen === 'lead' && (
        <div className="pd-screen">
          <span className="pd-kick">{t.raw('lead_kick')}</span>
          <h3 className="pd-h">{t.raw('lead_h')}</h3>
          <p className="pd-sub">{t.raw('lead_sub')}</p>
          <div className="field">
            <label htmlFor="pd-nom">{t.raw('lead_nom')}</label>
            <input
              id="pd-nom"
              type="text"
              value={nom}
              placeholder={t.raw('lead_nom_ph')}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="pd-tel">{t.raw('lead_tel')}</label>
            <input
              id="pd-tel"
              type="tel"
              value={tel}
              placeholder="06 00 00 00 00"
              onChange={(e) => setTel(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="pd-mail">{t.raw('lead_mail')}</label>
            <input
              id="pd-mail"
              type="email"
              value={mail}
              placeholder={t.raw('lead_mail_ph')}
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
          />

          <Turnstile onToken={onToken} />

          <p className="consent">{t.raw('lead_consent')}</p>
          {error && <p className="field-err">{errorMessage(error)}</p>}
          <button
            className="pd-btn"
            type="button"
            disabled={!leadReady || submitting}
            onClick={submit}
          >
            {submitting ? '…' : t.raw('lead_btn')}
          </button>
        </div>
      )}

      {/* RESULT */}
      {screen === 'result' && result && (
        <div className="pd-screen" style={{ padding: 0 }}>
          <div className={`verdict ${VERDICT_KEYS[result.verdict].cls}`}>
            <div className="vlabel">{t.raw('res_vlabel')}</div>
            <div className="vbig">{t.raw(VERDICT_KEYS[result.verdict].big)}</div>
            <div className="vmsg">{t.raw(VERDICT_KEYS[result.verdict].msg)}</div>
            <div className="score-row">
              <div>
                <div className="num">{result.score.ok}</div>
                <div className="lb">{t.raw('res_ok')}</div>
              </div>
              <div>
                <div className="num">{result.score.warn}</div>
                <div className="lb">{t.raw('res_warn')}</div>
              </div>
              <div>
                <div className="num">{result.score.bad}</div>
                <div className="lb">{t.raw('res_bad')}</div>
              </div>
            </div>
          </div>

          <div className="recos">
            <h3>{t.raw('res_recos_h')}</h3>
            {result.recommendations.length === 0 ? (
              <div className="reco">
                <span className="ic" style={{ background: '#0FA86A' }}>
                  ✓
                </span>
                <span>{t.raw('recos_none')}</span>
              </div>
            ) : (
              result.recommendations.map((r, i) => (
                <div className="reco" key={i}>
                  <span className="ic" style={{ background: r.lvl === 'bad' ? '#E0483B' : '#E8973A' }}>
                    !
                  </span>
                  <span>{r.t}</span>
                </div>
              ))
            )}
          </div>

          <div className="upsell">
            <div className="t">{t.raw('res_up_t')}</div>
            <div className="d">{t.raw('res_up_d')}</div>
            <Link className="pd-btn" href="/contact">
              {t.raw('res_up_btn')}
            </Link>
          </div>

          <Html as="p" className="disclaimer" html={t.raw('res_disc')} />
          <button className="restart" type="button" onClick={restart}>
            {t.raw('res_restart')}
          </button>
        </div>
      )}
    </div>
  );
}

function errorMessage(error: string): string {
  switch (error) {
    case 'captcha':
      return 'Vérification anti-robot échouée. Réessayez.';
    case 'spam':
      return 'Soumission rejetée.';
    default:
      return 'Une erreur est survenue. Réessayez.';
  }
}
