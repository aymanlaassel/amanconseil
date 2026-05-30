import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
import '../globals.css';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin · Aman Conseil',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <div className="admin">{children}</div>
      </body>
    </html>
  );
}
