import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const alt = 'Aman Conseil';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  const tagline = t.raw('hero_sub').replace(/<[^>]+>/g, '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0E1116',
          color: '#F3F4EF',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em' }}>
          aman<span style={{ color: '#0FA86A' }}>.</span>conseil
        </div>
        <div style={{ fontSize: 30, color: '#C5CCD2', marginTop: 28, maxWidth: 900, lineHeight: 1.3 }}>
          {tagline.slice(0, 140)}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: '#0FA86A',
            display: 'flex',
            gap: 18,
          }}
        >
          <span>🟢 / 🟠 / 🔴</span>
          <span style={{ color: '#9aa1a8' }}>Pré-diagnostic foncier gratuit · Maroc</span>
        </div>
      </div>
    ),
    size,
  );
}
