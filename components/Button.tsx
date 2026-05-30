import type { CSSProperties, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Variant = 'solid' | 'ghost' | 'dark';

export function Button({
  href,
  variant = 'solid',
  external,
  className,
  style,
  children,
  pill,
}: {
  href?: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Use the wizard-style full-width pill button (.pd-btn). */
  pill?: boolean;
}) {
  const base = pill ? 'pd-btn' : 'btn';
  const cls = [base, variant === 'ghost' ? 'ghost' : '', variant === 'dark' ? 'dark' : '', className]
    .filter(Boolean)
    .join(' ');

  if (!href) {
    return (
      <span className={cls} style={style}>
        {children}
      </span>
    );
  }

  if (external || href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a
        className={cls}
        href={href}
        style={style}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={cls} href={href} style={style}>
      {children}
    </Link>
  );
}
