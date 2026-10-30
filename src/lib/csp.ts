export type CspOptions = {
  nonce: string;
  isDev: boolean;
  /** Adds Cloudflare Turnstile sources when spam protection is enabled. */
  turnstile: boolean;
  upgradeInsecureRequests: boolean;
};

const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";

/**
 * Builds a strict, nonce-based Content Security Policy.
 * - Scripts: only nonce-bearing scripts (and those they load) may run.
 * - Styles: 'unsafe-inline' is required for inline style attributes emitted
 *   by next/image and Motion; scripts remain fully restricted.
 * - 'unsafe-eval' is only added in development (React dev tooling).
 */
export function buildContentSecurityPolicy({ nonce, isDev, turnstile, upgradeInsecureRequests }: CspOptions): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(isDev ? ["'unsafe-eval'"] : []), ...(turnstile ? [TURNSTILE_ORIGIN] : [])],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'"],
    "connect-src": ["'self'", ...(isDev ? ["ws:", "wss:"] : []), ...(turnstile ? [TURNSTILE_ORIGIN] : [])],
    "frame-src": turnstile ? [TURNSTILE_ORIGIN] : ["'none'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "media-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  const policy = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  if (upgradeInsecureRequests) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}
