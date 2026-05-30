import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAllArticles } from '@/lib/articles';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

const RES_LABELS: Record<Locale, { title: string; sub: string; empty: string; read: string }> = {
  fr: {
    title: 'Ressources',
    sub: 'Guides pratiques pour sécuriser votre projet immobilier au Maroc.',
    empty: 'Articles à venir.',
    read: 'Lire →',
  },
  ar: {
    title: 'موارد',
    sub: 'أدلة عملية لتأمين مشروعك العقاري في المغرب.',
    empty: 'مقالات قادمة قريبًا.',
    read: 'اقرأ ←',
  },
  en: {
    title: 'Resources',
    sub: 'Practical guides to secure your real-estate project in Morocco.',
    empty: 'Articles coming soon.',
    read: 'Read →',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const L = RES_LABELS[locale as Locale];
  return pageMetadata({
    locale: locale as Locale,
    pathname: '/ressources',
    title: L.title,
    description: L.sub,
  });
}

export default async function RessourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = RES_LABELS[locale as Locale];
  const articles = getAllArticles(locale);

  return (
    <section className="blk">
      <div className="wrap">
        <div className="shead">
          <span className="tag">{L.title}</span>
          <h2 className="disp">{L.title}</h2>
          <p>{L.sub}</p>
        </div>

        {articles.length === 0 ? (
          <p className="note">{L.empty}</p>
        ) : (
          <div className="prob">
            {articles.map((a) => (
              <Link key={a.slug} href={`/ressources/${a.slug}`} className="card" style={{ textDecoration: 'none' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  {a.title}
                </h3>
                <p style={{ fontSize: 14, color: '#39404a', marginBottom: 12 }}>{a.description}</p>
                <span className="tag" style={{ color: 'var(--accent-dim)' }}>
                  {L.read}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
