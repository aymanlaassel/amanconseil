import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/SectionHeader';
import { StepCard } from '@/components/StepCard';
import { Button } from '@/components/Button';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale: locale as Locale,
    pathname: '/methode',
    title: t.raw('etapes_h2').replace(/<[^>]+>/g, ''),
    description: t.raw('etapes_p').replace(/<[^>]+>/g, ''),
  });
}

// Each step maps (where it applies) to the deliverable wording from the offer tiers.
const STEPS = [
  { key: 'st1' },
  { key: 'st2', deliv: 'n1_deliv' },
  { key: 'st3', deliv: 'n2_deliv' },
  { key: 'st4', deliv: 'tier1_deliv' },
  { key: 'st5', deliv: 'tier2_deliv' },
  { key: 'st6' },
  { key: 'st7', deliv: 'tier3_deliv' },
] as const;

export default async function MethodePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="blk" id="methode">
      <div className="wrap">
        <SectionHeader
          tag={t.raw('etapes_tag')}
          title={t.raw('etapes_h2')}
          subtitle={t.raw('etapes_p')}
        />

        <div className="prose-block">
          {STEPS.map((s, i) => (
            <div key={s.key} style={{ marginBottom: 26 }}>
              <h3 className="disp" style={{ marginBottom: 4 }}>
                <span className="mono" style={{ color: 'var(--accent-dim)', marginInlineEnd: 10 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t.raw(`${s.key}_h`)}
              </h3>
              <p>{t.raw(`${s.key}_p`)}</p>
              {'deliv' in s && s.deliv ? (
                <span
                  className="deliv"
                  style={{
                    display: 'inline-block',
                    background: 'rgba(15,168,106,.14)',
                    color: 'var(--accent-dim)',
                    fontSize: 12.5,
                    padding: '6px 11px',
                    borderRadius: 5,
                  }}
                >
                  {t.raw(s.deliv)}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* Final highlight step */}
        <div className="steps" style={{ gridTemplateColumns: '1fr', maxWidth: 760, margin: '8px auto 0' }}>
          <StepCard num="★" title={t.raw('st8_h')} text={t.raw('st8_p')} highlight />
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Button href="/pre-diagnostic">{t.raw('nav_cta')}</Button>
        </div>
      </div>
    </section>
  );
}
