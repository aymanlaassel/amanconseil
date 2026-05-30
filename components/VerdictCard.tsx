import { getTranslations } from 'next-intl/server';
import { Button } from './Button';

/** Hero "verdict in 2 minutes" teaser card (🟢/🟠/🔴 rows + CTA). */
export async function VerdictCard() {
  const t = await getTranslations();
  return (
    <div className="vcard">
      <div className="vcard-h">{t.raw('vcard_h')}</div>
      <div className="vrow">
        <span className="dot g" />
        <span>{t.raw('vcard_green')}</span>
      </div>
      <div className="vrow">
        <span className="dot o" />
        <span>{t.raw('vcard_orange')}</span>
      </div>
      <div className="vrow">
        <span className="dot r" />
        <span>{t.raw('vcard_red')}</span>
      </div>
      <div className="vcard-cap">{t.raw('vcard_cap')}</div>
      <Button href="/pre-diagnostic">{t.raw('vcard_btn')}</Button>
    </div>
  );
}
