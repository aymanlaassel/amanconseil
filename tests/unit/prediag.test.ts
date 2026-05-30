import { describe, it, expect } from 'vitest';
import { computeResult, type Question } from '@/lib/prediag';
import { QUESTIONS } from '@/lib/prediag.data';

// Minimal synthetic questions to exercise the scoring rules in isolation.
function q(crit: Question['crit'], statuses: Array<Question['opts'][number]['s']>): Question {
  return {
    q: 'q',
    hint: 'h',
    crit,
    opts: statuses.map((s, i) => ({ t: `opt${i}`, s, r: s === 'ok' ? undefined : `reco ${s}` })),
  };
}

describe('computeResult — verdict rules (mirrors the maquette)', () => {
  it('all ok → vert, no recommendations', () => {
    const questions = [q('bloquant', ['ok', 'bad']), q('eleve', ['ok', 'bad'])];
    const r = computeResult(questions, [0, 0]);
    expect(r.verdict).toBe('vert');
    expect(r.score).toEqual({ ok: 2, warn: 0, bad: 0, blockingBad: 0 });
    expect(r.recommendations).toHaveLength(0);
  });

  it('a bad on a bloquant question → rouge', () => {
    const questions = [q('bloquant', ['ok', 'bad']), q('eleve', ['ok', 'bad'])];
    const r = computeResult(questions, [1, 0]);
    expect(r.verdict).toBe('rouge');
    expect(r.score.blockingBad).toBe(1);
  });

  it('a bad on a non-bloquant question (no blockingBad) → orange', () => {
    const questions = [q('eleve', ['ok', 'bad'])];
    const r = computeResult(questions, [1]);
    expect(r.verdict).toBe('orange');
    expect(r.score.blockingBad).toBe(0);
    expect(r.score.bad).toBe(1);
  });

  it('only warn/unk → orange, and unk counts as warn', () => {
    const questions = [q('moyen', ['ok', 'warn', 'unk'])];
    expect(computeResult(questions, [1]).verdict).toBe('orange');
    const r = computeResult(questions, [2]);
    expect(r.verdict).toBe('orange');
    expect(r.score.warn).toBe(1); // unk tallied as warn
  });

  it('recommendations: bad first, capped at 6', () => {
    const questions: Question[] = [];
    const answers: number[] = [];
    // 5 warn then 5 bad
    for (let i = 0; i < 5; i++) {
      questions.push(q('moyen', ['ok', 'warn']));
      answers.push(1);
    }
    for (let i = 0; i < 5; i++) {
      questions.push(q('eleve', ['ok', 'bad']));
      answers.push(1);
    }
    const r = computeResult(questions, answers);
    expect(r.recommendations).toHaveLength(6);
    // The first recommendations must be the bad ones.
    expect(r.recommendations[0]?.lvl).toBe('bad');
  });

  it('ignores unanswered questions', () => {
    const questions = [q('bloquant', ['ok', 'bad']), q('eleve', ['ok', 'bad'])];
    const r = computeResult(questions, [0]); // second answer missing
    expect(r.score.ok).toBe(1);
  });
});

describe('ported question data integrity', () => {
  it('has 10 questions in fr/ar/en with matching shape', () => {
    for (const locale of ['fr', 'ar', 'en'] as const) {
      expect(QUESTIONS[locale]).toHaveLength(10);
    }
    // Each question has the same criticality + option count across locales.
    QUESTIONS.fr.forEach((frQ, i) => {
      expect(QUESTIONS.ar[i]!.crit).toBe(frQ.crit);
      expect(QUESTIONS.en[i]!.crit).toBe(frQ.crit);
      expect(QUESTIONS.ar[i]!.opts).toHaveLength(frQ.opts.length);
      expect(QUESTIONS.en[i]!.opts.map((o) => o.s)).toEqual(frQ.opts.map((o) => o.s));
    });
  });

  it('every option has a valid status', () => {
    const valid = new Set(['ok', 'warn', 'unk', 'bad']);
    for (const locale of ['fr', 'ar', 'en'] as const) {
      for (const question of QUESTIONS[locale]) {
        for (const opt of question.opts) {
          expect(valid.has(opt.s)).toBe(true);
        }
      }
    }
  });

  it('a clean run (first option of every FR question) yields vert', () => {
    const answers = QUESTIONS.fr.map(() => 0);
    expect(computeResult(QUESTIONS.fr, answers).verdict).toBe('vert');
  });
});
