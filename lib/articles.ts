import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { routing } from '@/i18n/routing';

const DIR = path.join(process.cwd(), 'content', 'articles');

export type ArticleMeta = {
  slug: string;
  locale: string;
  title: string;
  description: string;
  date: string;
  keywords?: string;
};

export type Article = ArticleMeta & { content: string };

function fileFor(slug: string, locale: string): string {
  return path.join(DIR, `${slug}.${locale}.mdx`);
}

export function getArticleSlugs(locale: string): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(`.${locale}.mdx`))
    .map((f) => f.slice(0, -`.${locale}.mdx`.length));
}

export function getArticle(slug: string, locale: string): Article | null {
  const file = fileFor(slug, locale);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    keywords: data.keywords ? String(data.keywords) : undefined,
    content,
  };
}

export function getAllArticles(locale: string): ArticleMeta[] {
  return getArticleSlugs(locale)
    .map((slug) => getArticle(slug, locale))
    .filter((a): a is Article => a !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta);
}

/** Every (slug, locale) pair, for generateStaticParams + sitemap. */
export function getAllArticleParams(): Array<{ slug: string; locale: string }> {
  const out: Array<{ slug: string; locale: string }> = [];
  for (const locale of routing.locales) {
    for (const slug of getArticleSlugs(locale)) out.push({ slug, locale });
  }
  return out;
}
