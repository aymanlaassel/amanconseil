import { getTranslations } from 'next-intl/server';
import { Html } from './Html';
import { Button } from './Button';
import { VerdictCard } from './VerdictCard';

export async function Hero() {
  const t = await getTranslations();

  return (
    <section className="hero">
      <div className="grid-bg" />
      <div className="blob" />
      <div className="wrap hgrid">
        <div className="hero-left">
          <Html as="h1" className="disp" html={t.raw('hero_h1')} />
          <p className="sub">{t.raw('hero_sub')}</p>
          <p className="hero-money">{t.raw('hero_money')}</p>
          <div className="cta-row">
            <Button href="/pre-diagnostic">{t.raw('hero_cta1')}</Button>
            <Button
              href="/methode"
              variant="ghost"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}
            >
              {t.raw('hero_cta2')}
            </Button>
          </div>
          <div className="trust">
            <div>
              <span className="n">~80%</span>
              <Html className="l" html={t.raw('trust1')} />
            </div>
            <div>
              <span className="n">7</span>
              <Html className="l" html={t.raw('trust2')} />
            </div>
            <div>
              <span className="n">2 min</span>
              <Html className="l" html={t.raw('trust3')} />
            </div>
          </div>
        </div>
        <div className="hero-right">
          <VerdictCard />
        </div>
      </div>
    </section>
  );
}
