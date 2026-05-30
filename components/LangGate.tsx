'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, localeNames, localeShort, type Locale } from '@/i18n/routing';
import { hasSeenGate, markGateSeen } from '@/lib/lang-gate';

/**
 * First-visit full-screen language chooser (FR / العربية / English).
 * Remembered via a cookie so it only shows once. Replicated from the maquette.
 */
export function LangGate() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hasSeenGate()) setOpen(true);
  }, []);

  if (!open) return null;

  function choose(locale: Locale) {
    markGateSeen();
    setOpen(false);
    router.replace(pathname, { locale });
  }

  return (
    <div className="langgate" role="dialog" aria-modal="true" aria-label="Choose your language">
      <div className="gbrand">
        aman<span className="c">.</span>conseil
      </div>
      <div className="gbase">Choisissez votre langue · اختر لغتك · Choose your language</div>
      <div className="gopts">
        {routing.locales.map((locale) => (
          <button key={locale} type="button" className="gopt" onClick={() => choose(locale)}>
            <span className="lg">{localeNames[locale]}</span>
            <span className="ls">{localeShort[locale]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
