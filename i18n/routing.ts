import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'ar', 'en'],
  defaultLocale: 'fr',
  // Always prefix the locale in the URL (/fr, /ar, /en). Root `/` redirects to
  // the negotiated locale (Accept-Language → fallback `fr`).
  localePrefix: 'always',
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  ar: 'العربية',
  en: 'English',
};

export const localeShort: Record<Locale, string> = {
  fr: 'FR',
  ar: 'ع',
  en: 'EN',
};

export function isRtl(locale: string): boolean {
  return locale === 'ar';
}
