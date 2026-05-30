import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Html } from './Html';
import { WHATSAPP_URL, CONTACT_EMAIL } from '@/lib/site';

/** WhatsApp / email / book-a-call strip (shared by Home and Contact). */
export async function ContactWays() {
  const t = await getTranslations();
  return (
    <div className="ways">
      <a className="way" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
        <Html html={t.raw('contact_wa')} />
      </a>
      <a className="way" href={`mailto:${CONTACT_EMAIL}`}>
        <Html html={t.raw('contact_mail')} />
      </a>
      <Link className="way" href="/pre-diagnostic">
        <Html html={t.raw('contact_rdv')} />
      </Link>
    </div>
  );
}
