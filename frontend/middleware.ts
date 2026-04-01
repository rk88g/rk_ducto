import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const sessionCookieName = "rk_ducto_session";

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(sessionCookieName);

  if (!hasSession) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/map/:path*"]
};

