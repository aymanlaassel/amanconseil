import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Html } from './Html';
import { WHATSAPP_URL } from '@/lib/site';

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="site">
      <div className="wrap">
        <div className="top">
          <div>
            <div className="brand disp">
              aman<span className="c" style={{ color: 'var(--accent)' }}>
                .
              </span>
              conseil
            </div>
            <p className="bl">{t.raw('foot_bl')}</p>
          </div>
          <div className="cols">
            <div className="col">
              <h5>{t.raw('foot_c1')}</h5>
              <Link href="/methode">
                <Html html={t.raw('nav_how')} />
              </Link>
              <Link href="/offre">
                <Html html={t.raw('nav_offre')} />
              </Link>
              <Link href="/#confiance">{t.raw('foot_why')}</Link>
            </div>
            <div className="col">
              <h5>{t.raw('foot_c2')}</h5>
              <Link href="/pre-diagnostic">{t.raw('nav_cta')}</Link>
              <Link href="/contact">{t.raw('nav_contact')}</Link>
              <Link href="/prestataires">{t.raw('nav_prest')}</Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
            <div className="col">
              <h5>{t.raw('foot_c3')}</h5>
              <Link href="/mentions-legales">{t.raw('foot_l1')}</Link>
              <Link href="/cgu">{t.raw('foot_l2')}</Link>
              <Link href="/confidentialite">{t.raw('foot_l3')}</Link>
            </div>
          </div>
        </div>
        <div className="legal">{t.raw('foot_legal')}</div>
      </div>
    </footer>
  );
}
