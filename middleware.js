import { NextResponse } from "next/server";

export function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Detect authentication via custom JWT or NextAuth cookies
  const jwtToken = req.cookies.get("token")?.value || req.cookies.get("auth-token")?.value;
  const nextAuthToken =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value;
  const headerAuth = req.headers.get("Authorization");
  const token = jwtToken || nextAuthToken || headerAuth;

  const isApiRoute = pathname.startsWith("/api");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/signin");
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/public");

  const isLandingPage = pathname === "/";

  // Allow API routes through (they should handle 401 themselves)
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users away from protected routes
  // Use the actual sign-in route used in the app: "/signin"
  if (!token && !isAuthRoute && !isPublicAsset && !isLandingPage) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // If authenticated, prevent navigating to auth pages
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/(.*)", // apply to all routes; internal checks exclude public assets and APIs
  ],
};
