import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/SectionHeader';
import { ProviderForm } from '@/components/ProviderForm';
import { Html } from '@/components/Html';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t.raw('prest_h2').replace(/<[^>]+>/g, ''),
    description: t.raw('prest_p').replace(/<[^>]+>/g, ''),
  };
}

export default async function PrestatairesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="blk" id="prestataires">
      <div className="wrap">
        <SectionHeader
          tag={t.raw('prest_tag')}
          title={t.raw('prest_h2')}
          subtitle={t.raw('prest_p')}
        />
        <div className="prest">
          <div>
            <p className="lead-txt">{t.raw('prest_why')}</p>
            <Html as="ul" className="benefits" html={t.raw('prest_benefits')} />
          </div>
          <ProviderForm />
        </div>
      </div>
    </section>
  );
}
