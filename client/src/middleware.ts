import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PATH = process.env.ADMIN_PATH || 'cp-internal-manage';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/manage')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/manage/:path*'],
};
