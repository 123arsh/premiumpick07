import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const getAdminPath = () => process.env.ADMIN_PATH || 'cp-x7k9m2n4p1q8';

export function middleware(request: NextRequest) {
  const adminPath = getAdminPath();
  const { pathname } = request.nextUrl;

  // Rewrite secret admin URL → internal /manage routes (runtime on Vercel)
  if (pathname === `/${adminPath}` || pathname.startsWith(`/${adminPath}/`)) {
    const newPath = pathname.replace(`/${adminPath}`, '/manage') || '/manage';
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.rewrite(url);
  }

  // Block typing /manage directly in the browser
  if (pathname === '/manage' || pathname.startsWith('/manage/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/manage',
    '/manage/:path*',
    '/cp-x7k9m2n4p1q8',
    '/cp-x7k9m2n4p1q8/:path*',
    '/cp-internal-manage',
    '/cp-internal-manage/:path*',
  ],
};
