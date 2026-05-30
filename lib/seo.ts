import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

/**
 * Builds canonical + hreflang alternates for a localized page.
 * `pathname` is the route after the locale, e.g. '/offre' (or '' for home).
 */
export function alternatesFor(locale: string, pathname = ''): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${pathname}`;
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${pathname}`;
  return {
    canonical: `${SITE_URL}/${locale}${pathname}`,
    languages,
  };
}

/** Convenience: full localized Metadata for a content page. */
export function pageMetadata(opts: {
  locale: Locale;
  pathname?: string;
  title: string;
  description: string;
}): Metadata {
  const { locale, pathname = '', title, description } = opts;
  return {
    title,
    description,
    alternates: alternatesFor(locale, pathname),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${pathname}`,
      siteName: 'Aman Conseil',
      locale,
      type: 'website',
    },
  };
}

/** Organization + LocalBusiness JSON-LD for the Moroccan advisory firm. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    name: 'Aman Conseil',
    url: SITE_URL,
    email: 'contact@amanconseil.ma',
    areaServed: 'MA',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
    },
    description:
      "Cabinet de conseil et d'assistance à maîtrise d'ouvrage en promotion immobilière au Maroc.",
    knowsLanguage: ['fr', 'ar', 'en'],
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
