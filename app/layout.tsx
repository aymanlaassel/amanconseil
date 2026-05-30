/**
 * Root layout is a pass-through: the <html>/<body> (with the correct lang/dir
 * and fonts) is rendered by app/[locale]/layout.tsx, and the non-localized
 * back-office renders its own shell under app/admin.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
