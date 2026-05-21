/**
 * Vercel Edge Middleware — runs at the CDN edge before any file is served.
 * Protects all /work/* routes with server-side cookie check.
 * No HTML is ever sent to unauthenticated requests.
 */
export default function middleware(request) {
  const cookieHeader = request.headers.get('cookie') || '';

  // Parse cookies manually (Edge Runtime; no Next.js cookie helper)
  const isAuthenticated = cookieHeader
    .split(';')
    .some(c => c.trim().startsWith('portfolio_auth=ok'));

  if (isAuthenticated) {
    return; // pass through — serve the file normally
  }

  // Not authenticated → redirect to the password page
  const { pathname } = new URL(request.url);
  const authUrl = new URL('/auth', request.url);
  authUrl.searchParams.set('next', pathname);
  return Response.redirect(authUrl.toString(), 302);
}

// Only run on /work/* pages
export const config = {
  matcher: ['/work/:path*'],
};
