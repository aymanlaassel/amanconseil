import type { Config } from 'tailwindcss';

/**
 * Brand tokens ported verbatim from the maquette charter (site-maquette/index.html).
 * The traffic-light system (accent / orange / red) is shared between the brand and
 * the pre-diagnosis verdict — keep it consistent.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0E1116',
        ink2: '#171C22',
        paper: '#F3F4EF',
        paper2: '#FBFBF8',
        line: '#E1E3DC',
        muted: '#6E747A',
        accent: '#0FA86A',
        accentDim: '#0B8455',
        orange: '#E8973A',
        red: '#E0483B',
      },
      fontFamily: {
        // Wired to next/font CSS variables (see lib/fonts.ts).
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        wrap: '1080px',
      },
      letterSpacing: {
        tightest: '-.03em',
      },
    },
  },
  plugins: [],
};

export default config;
