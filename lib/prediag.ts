// Pre-diagnosis scoring. Mirrors the maquette `computeResult` EXACTLY.
// The questions/options live in lib/prediag.data.ts (generated from the maquette).
// Never change the questions or scoring without sign-off (see CLAUDE.md).

import type { Locale } from '@/i18n/routing';

export type OptionStatus = 'ok' | 'warn' | 'unk' | 'bad';
export type Criticality = 'bloquant' | 'eleve' | 'moyen';

export interface Option {
  t: string;
  s: OptionStatus;
  r?: string;
}

export interface Question {
  q: string;
  hint: string;
  crit: Criticality;
  opts: Option[];
}

export type LocalizedQuestions = Record<Locale, Question[]>;

export interface Score {
  ok: number;
  warn: number; // warn + unk, as in the maquette
  bad: number;
  blockingBad: number;
}

export type VerdictColor = 'vert' | 'orange' | 'rouge';

export interface Recommendation {
  lvl: 'bad' | 'warn';
  t: string;
}

export interface PrediagResult {
  verdict: VerdictColor;
  score: Score;
  recommendations: Recommendation[];
}

export const QUESTION_COUNT = 10;

/**
 * Tally answers and derive the verdict, exactly like the maquette:
 *  - warn + unk → "à vérifier" (warn); bad → "alerte".
 *  - a `bad` on a `bloquant` question increments blockingBad.
 *  - blockingBad > 0 → rouge; else any bad/warn → orange; else vert.
 *  - recommendations: collect `r` from non-ok answers, bad first, keep top 6.
 */
export function computeResult(questions: Question[], answers: number[]): PrediagResult {
  let ok = 0;
  let warn = 0;
  let bad = 0;
  let blockingBad = 0;
  const recos: Recommendation[] = [];

  questions.forEach((question, qi) => {
    const ai = answers[qi];
    const o = ai != null ? question.opts[ai] : undefined;
    if (!o) return;

    if (o.s === 'ok') {
      ok++;
    } else if (o.s === 'warn' || o.s === 'unk') {
      warn++;
      if (o.r) recos.push({ lvl: 'warn', t: o.r });
    } else if (o.s === 'bad') {
      bad++;
      if (question.crit === 'bloquant') blockingBad++;
      if (o.r) recos.push({ lvl: 'bad', t: o.r });
    }
  });

  let verdict: VerdictColor;
  if (blockingBad > 0) verdict = 'rouge';
  else if (bad > 0 || warn > 0) verdict = 'orange';
  else verdict = 'vert';

  const recommendations = recos.sort((a, b) => (a.lvl === 'bad' ? -1 : 1)).slice(0, 6);

  return { verdict, score: { ok, warn, bad, blockingBad }, recommendations };
}

/** Maps the verdict color to the message-catalog keys for the result screen. */
export const VERDICT_KEYS: Record<VerdictColor, { cls: string; big: string; msg: string }> = {
  vert: { cls: 'v-green', big: 'v_green_big', msg: 'v_green_msg' },
  orange: { cls: 'v-orange', big: 'v_orange_big', msg: 'v_orange_msg' },
  rouge: { cls: 'v-rouge', big: 'v_red_big', msg: 'v_red_msg' },
};
