import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, the non-localized /admin back-office,
  // Next internals, and files with an extension.
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
