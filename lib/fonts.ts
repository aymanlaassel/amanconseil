import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono, Tajawal } from 'next/font/google';

// Display (FR/EN headings)
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

// Body (FR/EN)
export const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

// Monospace (tags, numbers)
export const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// Arabic (used for AR locale + bilingual brand accents)
export const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

/** All four font CSS variables, for the <html> className. */
export const fontVariables = `${bricolage.variable} ${hanken.variable} ${jetbrains.variable} ${tajawal.variable}`;
