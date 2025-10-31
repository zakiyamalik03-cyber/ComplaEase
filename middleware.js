import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value 
              || req.cookies.get("auth-token")?.value 
              || req.headers.get("Authorization");
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/signin') || 
                      req.nextUrl.pathname.startsWith('/signup');

  // Don't redirect API routes, just let them fail with 401
  if (isApiRoute) {
    return NextResponse.next();
  }

  // If no token and trying to access protected route, redirect to signin
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // If has token and trying to access auth routes, redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/api/:path*',
    '/signin',
    '/signup'
  ],
};
