import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/SectionHeader';
import { ContactForm } from '@/components/ContactForm';
import { ContactWays } from '@/components/ContactWays';
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
    pathname: '/contact',
    title: t.raw('contact_h2').replace(/<[^>]+>/g, ''),
    description: t.raw('contact_p').replace(/<[^>]+>/g, ''),
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="blk" id="contact">
      <div className="wrap">
        <SectionHeader
          tag={t.raw('contact_tag')}
          title={t.raw('contact_h2')}
          subtitle={t.raw('contact_p')}
        />
        <div className="prest">
          <div>
            <ContactForm />
          </div>
          <div>
            <ContactWays />
          </div>
        </div>
      </div>
    </section>
  );
}
