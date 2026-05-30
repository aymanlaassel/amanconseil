import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Html } from './Html';
import { LangSwitcher } from './LangSwitcher';

const NAV_LINKS = [
  { href: '/methode', key: 'nav_how' },
  { href: '/offre', key: 'nav_offre' },
  { href: '/prestataires', key: 'nav_prest' },
  { href: '/contact', key: 'nav_contact' },
] as const;

export async function Header() {
  const t = await getTranslations();

  return (
    <header className="nav">
      <div className="wrap">
        <Link href="/" className="brand">
          aman<span className="c">.</span>conseil
        </Link>
        <nav>
          {NAV_LINKS.map(({ href, key }) => (
            <Link key={href} href={href}>
              <Html html={t.raw(key)} />
            </Link>
          ))}
          <Link href="/pre-diagnostic" className="navcta">
            {t.raw('nav_cta')}
          </Link>
          <LangSwitcher />
        </nav>
        <Link href="/pre-diagnostic" className="burger" aria-label={t.raw('nav_cta')}>
          ☰
        </Link>
      </div>
    </header>
  );
}
