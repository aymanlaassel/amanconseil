import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/SectionHeader';
import { PrediagWizard } from '@/components/PrediagWizard';
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
    pathname: '/pre-diagnostic',
    title: t.raw('pd_h2').replace(/<[^>]+>/g, ''),
    description: t.raw('pd_p').replace(/<[^>]+>/g, ''),
  });
}

export default async function PrediagPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="blk" id="prediag" style={{ background: 'var(--ink)' }}>
      <div className="wrap">
        <div className="shead">
          <span className="tag" style={{ color: 'var(--accent)' }}>
            {t.raw('pd_tag')}
          </span>
          <h2 className="disp" style={{ color: 'var(--paper)' }}>
            {t.raw('pd_h2')}
          </h2>
          <p style={{ color: '#9aa1a8' }}>{t.raw('pd_p')}</p>
        </div>
        <PrediagWizard />
      </div>
    </section>
  );
}
