import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './dictionaries/config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { adminApp } from './firebase/server/config';
import { getAuth } from 'firebase-admin/auth';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (e) {
    // Sometimes the matchLocale function throws an error, so we fallback to the default locale
    return i18n.defaultLocale;
  }
}

async function handleSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) {
    // If no session, clear any existing user data by redirecting to an API route that clears the cookie
    // This is a placeholder for a more robust session management flow.
    return NextResponse.next();
  }

  try {
    // Initialize admin app to verify token
    adminApp;
    const decodedClaims = await getAuth().verifySessionCookie(session, true);
    // You can add logic here based on decodedClaims if needed
    return NextResponse.next();
  } catch (error) {
    console.error('Error verifying session cookie in middleware:', error);
    // Invalid session, redirect to clear it, or to a login page
    const response = NextResponse.redirect(new URL('/api/auth/logout', request.url));
    response.cookies.delete('session');
    return response;
  }
}


export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // Handle session management for all other routes
  return await handleSession(request);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
