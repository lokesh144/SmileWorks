import "server-only";

export class RequestGuardError extends Error {
  constructor(
    readonly status: 400 | 403 | 413 | 415,
    readonly publicMessage: string,
  ) {
    super(publicMessage);
    this.name = "RequestGuardError";
  }
}

export type OriginPolicy = {
  /** Explicitly trusted origins, e.g. the configured production site URL. */
  allowedOrigins: ReadonlyArray<string>;
  /** Whether X-Forwarded-Host may be used to determine the request host. */
  trustProxyHeaders: boolean;
};

/**
 * CSRF defence for the JSON endpoint: the browser-supplied Origin must match
 * this site. Combined with the JSON content-type requirement, cross-site
 * form posts and simple CORS requests are rejected.
 */
export function assertSameOrigin(headers: Headers, policy: OriginPolicy) {
  const fetchSite = headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw new RequestGuardError(403, "Request not allowed.");
  }

  const origin = headers.get("origin");
  if (!origin) throw new RequestGuardError(403, "Request not allowed.");

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    throw new RequestGuardError(403, "Request not allowed.");
  }

  if (policy.allowedOrigins.includes(originUrl.origin)) return;

  const forwardedHost = policy.trustProxyHeaders ? headers.get("x-forwarded-host")?.split(",")[0]?.trim() : null;
  const host = forwardedHost || headers.get("host");
  if (host && originUrl.host === host) return;

  throw new RequestGuardError(403, "Request not allowed.");
}

export function assertJsonContentType(headers: Headers) {
  const contentType = headers.get("content-type") ?? "";
  const mediaType = contentType.split(";")[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    throw new RequestGuardError(415, "Unsupported content type.");
  }
}

/** Reads the request body as text, aborting once `maxBytes` is exceeded. */
export async function readBodyWithLimit(request: Request, maxBytes: number): Promise<string> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new RequestGuardError(413, "Request is too large.");
  }
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      throw new RequestGuardError(413, "Request is too large.");
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(merged);
}

export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new RequestGuardError(400, "Invalid request.");
  }
}

/**
 * Client IP for rate limiting. Forwarded headers are only honored when the
 * deployment explicitly trusts its reverse proxy; otherwise null is returned
 * and callers fall back to a shared bucket.
 */
export function getClientIp(headers: Headers, trustProxyHeaders: boolean): string | null {
  if (!trustProxyHeaders) return null;
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded ? forwarded.slice(0, 64) : null;
}
