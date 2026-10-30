import type { NextConfig } from "next";

/**
 * Pages are rendered per request so every response carries a fresh CSP
 * nonce (see src/proxy.ts). Nonce-based CSP is incompatible with Partial
 * Prerendering, so Cache Components and Partial Prefetching are disabled.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Only local images are optimized. Add explicit, narrow remotePatterns
    // entries here if a trusted image CDN is introduced.
    remotePatterns: [],
    localPatterns: [
      { pathname: "/brand/**", search: "" },
      { pathname: "/images/**", search: "" },    ],
    qualities: [75, 90],
    dangerouslyAllowSVG: false,
  },
  serverExternalPackages: ["pg"],
  experimental: {
    serverActions: {
      // No Server Actions are used; keep limits tight in case any are added.
      bodySizeLimit: "64kb",
      allowedOrigins: [],
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "default-src 'none'; frame-ancestors 'none'" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
