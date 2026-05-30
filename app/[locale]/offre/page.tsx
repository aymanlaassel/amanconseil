import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/SectionHeader';
import { OfferTiers, AlaCarteCard } from '@/components/OfferTiers';
import { Html } from '@/components/Html';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t.raw('o_h2').replace(/<[^>]+>/g, ''),
    description: t.raw('o_p').replace(/<[^>]+>/g, ''),
  };
}

export default async function OffrePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="blk" id="offre">
      <div className="wrap">
        <SectionHeader tag={t.raw('o_tag')} title={t.raw('o_h2')} subtitle={t.raw('o_p')} />
        <div className="packs">
          <OfferTiers />
          <AlaCarteCard />
        </div>
        <Html as="p" className="note" html={t.raw('o_note')} />
      </div>
    </section>
  );
}
