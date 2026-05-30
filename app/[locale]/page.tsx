import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Html } from '@/components/Html';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="hero">
      <div className="grid-bg" />
      <div className="blob" />
      <div className="wrap" style={{ position: 'relative', padding: '78px 22px 86px' }}>
        <h1 className="disp">
          <Html html={t.raw('hero_h1')} />
        </h1>
        <p className="sub">{t.raw('hero_sub')}</p>
        <div className="cta-row">
          <Link href="/pre-diagnostic" className="btn">
            {t.raw('hero_cta1')}
          </Link>
          <Link
            href="/methode"
            className="btn ghost"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}
          >
            {t.raw('hero_cta2')}
          </Link>
        </div>
      </div>
    </section>
  );
}
