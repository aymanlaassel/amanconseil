import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';
import { getArticleSlugs } from '@/lib/articles';

// Static localized routes (after the locale prefix).
const ROUTES = [
  '',
  '/methode',
  '/offre',
  '/pre-diagnostic',
  '/prestataires',
  '/contact',
  '/ressources',
  '/mentions-legales',
  '/cgu',
  '/confidentialite',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of ROUTES) {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${route}`;
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/pre-diagnostic' ? 0.9 : 0.7,
        alternates: { languages },
      });
    }
  }

  for (const locale of routing.locales) {
    for (const slug of getArticleSlugs(locale)) {
      entries.push({
        url: `${SITE_URL}/${locale}/ressources/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
