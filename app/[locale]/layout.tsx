import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, isRtl, type Locale } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { SITE_URL } from '@/lib/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LangGate } from '@/components/LangGate';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: '' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'Aman Conseil',
      template: '%s · Aman Conseil',
    },
    description: t.raw('hero_sub').replace(/<[^>]+>/g, ''),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'} className={fontVariables}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LangGate />
          <Header />
          <main id="top">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
