import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization");

  // If no token, redirect to signin
  if (!token && !req.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
