import { LEGAL, type LegalSlug } from '@/lib/legal-content';
import type { Locale } from '@/i18n/routing';
import { Html } from './Html';

const UPDATED_LABEL: Record<Locale, string> = {
  fr: 'Dernière mise à jour :',
  ar: 'آخر تحديث:',
  en: 'Last updated:',
};

export function LegalPage({ slug, locale }: { slug: LegalSlug; locale: Locale }) {
  const doc = LEGAL[slug];
  return (
    <section className="blk">
      <div className="wrap">
        <div className="prose-block">
          <h1 className="disp" style={{ fontSize: 34, letterSpacing: '-.02em', marginBottom: 6 }}>
            {doc.title[locale]}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>
            {UPDATED_LABEL[locale]} {doc.updated[locale]}
          </p>
          <Html html={doc.body[locale]} />
        </div>
      </div>
    </section>
  );
}
