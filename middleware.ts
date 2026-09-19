import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'qadri_secret_jwt_key_984392849234_secure_admin_token_2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const AUTH_COOKIE_NAME = 'qadri_admin_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // If user is accessing /admin/login while already authenticated, redirect to /admin
  if (pathname === '/admin/login') {
    if (isValid) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Protect Admin Pages (/admin/*)
  if (pathname.startsWith('/admin')) {
    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect Admin API Routes (/api/admin/*) except /api/admin/login and /api/admin/setup
  if (pathname.startsWith('/api/admin')) {
    if (pathname === '/api/admin/login' || pathname === '/api/admin/setup') {
      return NextResponse.next();
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
