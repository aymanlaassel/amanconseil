import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/Hero';
import { SectionHeader } from '@/components/SectionHeader';
import { Card } from '@/components/Card';
import { StepCard } from '@/components/StepCard';
import { ContactWays } from '@/components/ContactWays';
import { Button } from '@/components/Button';
import { Html } from '@/components/Html';

const STEPS = ['st1', 'st2', 'st3', 'st4', 'st5', 'st6', 'st7'] as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Hero />

      {/* PROBLÈME */}
      <section className="blk" id="probleme">
        <div className="wrap">
          <SectionHeader tag={t.raw('prob_tag')} title={t.raw('prob_h2')} subtitle={t.raw('prob_p')} />
          <div className="prob">
            <Card icon="⚠" title={t.raw('prob1_h')} text={t.raw('prob1_p')} />
            <Card icon="⚠" title={t.raw('prob2_h')} text={t.raw('prob2_p')} />
            <Card icon="⚠" title={t.raw('prob3_h')} text={t.raw('prob3_p')} />
          </div>
        </div>
      </section>

      {/* CIBLE */}
      <section className="blk" id="cible">
        <div className="wrap">
          <SectionHeader
            tag={t.raw('cible_tag')}
            title={t.raw('cible_h2')}
            subtitle={t.raw('cible_p')}
          />
          <div className="prob cible">
            <Card icon="＄" title={t.raw('cible1_h')} text={t.raw('cible1_p')} />
            <Card icon="▣" title={t.raw('cible2_h')} text={t.raw('cible2_p')} />
            <Card icon="⚇" title={t.raw('cible3_h')} text={t.raw('cible3_p')} />
          </div>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="blk" id="etapes" style={{ background: 'var(--paper2)' }}>
        <div className="wrap">
          <SectionHeader
            tag={t.raw('etapes_tag')}
            title={t.raw('etapes_h2')}
            subtitle={t.raw('etapes_p')}
          />
          <div className="steps">
            {STEPS.map((s, i) => (
              <StepCard
                key={s}
                num={String(i + 1).padStart(2, '0')}
                title={t.raw(`${s}_h`)}
                text={t.raw(`${s}_p`)}
              />
            ))}
            <StepCard num="★" title={t.raw('st8_h')} text={t.raw('st8_p')} highlight />
          </div>
        </div>
      </section>

      {/* CONFIANCE */}
      <section className="blk" id="confiance">
        <div className="wrap">
          <SectionHeader tag={t.raw('conf_tag')} title={t.raw('conf_h2')} subtitle={t.raw('conf_p')} />
          <ul className="conf">
            {['conf1', 'conf2', 'conf3', 'conf4'].map((c) => (
              <li key={c}>
                <span className="ic">✓</span>
                <div>
                  <h4>{t.raw(`${c}_h`)}</h4>
                  <p>{t.raw(`${c}_p`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* OFFRE (summary + CTA) */}
      <section className="blk" id="offre" style={{ background: 'var(--paper2)' }}>
        <div className="wrap">
          <SectionHeader tag={t.raw('o_tag')} title={t.raw('o_h2')} subtitle={t.raw('o_p')} />
          <div className="cta-row" style={{ justifyContent: 'center', display: 'flex', gap: 14 }}>
            <Button href="/offre">{t.raw('nav_offre')}</Button>
            <Button href="/pre-diagnostic" variant="dark">
              {t.raw('nav_cta')}
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT strip */}
      <section className="blk" id="contact">
        <div className="wrap">
          <div className="contact">
            <div>
              <Html className="tag" html={t.raw('contact_tag')} />
              <Html as="h2" className="disp" html={t.raw('contact_h2')} />
              <p>{t.raw('contact_p')}</p>
              <Button href="/pre-diagnostic">{t.raw('contact_btn')}</Button>
            </div>
            <ContactWays />
          </div>
        </div>
      </section>
    </>
  );
}
