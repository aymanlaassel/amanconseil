import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Link } from '@/i18n/navigation';
import { getArticle, getAllArticleParams } from '@/lib/articles';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';
import type { Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return getAllArticleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug, locale);
  if (!article) return {};
  return {
    ...pageMetadata({
      locale: locale as Locale,
      pathname: `/ressources/${slug}`,
      title: article.title,
      description: article.description,
    }),
    keywords: article.keywords,
  };
}

// Internal MDX links get locale-prefixed; external links open as-is.
function mdxComponents(locale: string) {
  return {
    a: ({ href = '', children }: { href?: string; children?: React.ReactNode }) =>
      href.startsWith('/') ? (
        <Link href={href}>{children}</Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getArticle(slug, locale);
  if (!article) notFound();

  const { content } = await compileMDX({
    source: article.content,
    components: mdxComponents(locale),
    options: { parseFrontmatter: false },
  });

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'Aman Conseil' },
    publisher: { '@type': 'Organization', name: 'Aman Conseil' },
    mainEntityOfPage: `${SITE_URL}/${locale}/ressources/${slug}`,
  };

  return (
    <article className="blk">
      <div className="wrap">
        <div className="prose-block">
          <h1 className="disp" style={{ fontSize: 32, letterSpacing: '-.02em', marginBottom: 8 }}>
            {article.title}
          </h1>
          {article.date ? (
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>{article.date}</p>
          ) : null}
          {content}
        </div>
      </div>
      <JsonLd data={articleLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Ressources', url: `${SITE_URL}/${locale}/ressources` },
          { name: article.title, url: `${SITE_URL}/${locale}/ressources/${slug}` },
        ])}
      />
    </article>
  );
}
