import { NextResponse, type NextRequest } from "next/server";
import { buildContentSecurityPolicy } from "@/lib/csp";

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const forwardedProto = process.env.TRUST_PROXY_HEADERS === "true" ? request.headers.get("x-forwarded-proto") : null;
  const isHttps = request.nextUrl.protocol === "https:" || forwardedProto === "https";

  const csp = buildContentSecurityPolicy({
    nonce,
    isDev,
    turnstile: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
    upgradeInsecureRequests: !isDev && isHttps,
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  if (!isDev && isHttps) {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  }
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only — API routes, static files and metadata images are excluded.
      source: "/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|brand/|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
