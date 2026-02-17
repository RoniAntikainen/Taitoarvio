// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasAuthCookie(req: NextRequest) {
  // Auth.js / NextAuth cookie names (http vs https)
  const c = req.cookies;
  return (
    c.has("authjs.session-token") ||
    c.has("__Secure-authjs.session-token") ||
    c.has("next-auth.session-token") ||
    c.has("__Secure-next-auth.session-token")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Suojaa vain appin sisäiset reitit
  if (!pathname.startsWith("/app")) return NextResponse.next();

  // päästä login ja auth endpointit läpi
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // jos ei ole session-cookiea → login
  if (!hasAuthCookie(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/api/auth/signin";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
