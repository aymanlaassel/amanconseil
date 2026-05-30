'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, localeShort, type Locale } from '@/i18n/routing';
import { markGateSeen } from '@/lib/lang-gate';

/** FR / ع / EN pill switcher in the header. Preserves the current path. */
export function LangSwitcher() {
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: Locale) {
    if (locale === current) return;
    markGateSeen();
    router.replace(pathname, { locale });
  }

  return (
    <span className="langsel" role="group" aria-label="Language">
      {routing.locales.map((locale) => (
        <a
          key={locale}
          role="button"
          tabIndex={0}
          aria-current={locale === current ? 'true' : undefined}
          className={locale === current ? 'on' : undefined}
          onClick={() => switchTo(locale)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              switchTo(locale);
            }
          }}
        >
          {localeShort[locale]}
        </a>
      ))}
    </span>
  );
}
