import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy } from "@/lib/csp";
import {
  RequestGuardError,
  assertJsonContentType,
  assertSameOrigin,
  getClientIp,
  readBodyWithLimit,
} from "@/lib/request-guard";

const policy = { allowedOrigins: ["https://www.example.com"], trustProxyHeaders: false };

function expectGuardStatus(fn: () => unknown, status: number) {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(RequestGuardError);
    expect((error as RequestGuardError).status).toBe(status);
    return;
  }
  throw new Error("Expected guard to throw");
}

describe("assertSameOrigin", () => {
  it("accepts configured origins and same-host requests", () => {
    expect(() => assertSameOrigin(new Headers({ origin: "https://www.example.com" }), policy)).not.toThrow();
    expect(() =>
      assertSameOrigin(new Headers({ origin: "http://localhost:3000", host: "localhost:3000" }), policy),
    ).not.toThrow();
  });

  it("rejects missing, foreign and cross-site origins", () => {
    expectGuardStatus(() => assertSameOrigin(new Headers({ host: "www.example.com" }), policy), 403);
    expectGuardStatus(() => assertSameOrigin(new Headers({ origin: "https://evil.test", host: "www.example.com" }), policy), 403);
    expectGuardStatus(
      () =>
        assertSameOrigin(
          new Headers({ origin: "https://www.example.com", "sec-fetch-site": "cross-site" }),
          policy,
        ),
      403,
    );
  });

  it("ignores X-Forwarded-Host unless the proxy is trusted", () => {
    const headers = new Headers({ origin: "https://evil.test", host: "internal:3000", "x-forwarded-host": "evil.test" });
    expectGuardStatus(() => assertSameOrigin(headers, policy), 403);
    expect(() => assertSameOrigin(headers, { ...policy, trustProxyHeaders: true })).not.toThrow();
  });
});

describe("assertJsonContentType", () => {
  it("only accepts application/json", () => {
    expect(() => assertJsonContentType(new Headers({ "content-type": "application/json; charset=utf-8" }))).not.toThrow();
    expectGuardStatus(() => assertJsonContentType(new Headers({ "content-type": "application/x-www-form-urlencoded" })), 415);
    expectGuardStatus(() => assertJsonContentType(new Headers()), 415);
  });
});

describe("readBodyWithLimit", () => {
  it("reads bodies under the limit", async () => {
    const request = new Request("http://localhost/api", { method: "POST", body: "hello" });
    await expect(readBodyWithLimit(request, 10)).resolves.toBe("hello");
  });

  it("rejects bodies over the limit even without Content-Length", async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("x".repeat(64)));
        controller.close();
      },
    });
    const request = new Request("http://localhost/api", { method: "POST", body: stream, duplex: "half" } as RequestInit);
    await expect(readBodyWithLimit(request, 16)).rejects.toMatchObject({ status: 413 });
  });
});

describe("getClientIp", () => {
  const headers = new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" });
  it("returns null unless proxy headers are trusted", () => {
    expect(getClientIp(headers, false)).toBeNull();
    expect(getClientIp(headers, true)).toBe("203.0.113.9");
  });
});

describe("buildContentSecurityPolicy", () => {
  it("is strict in production", () => {
    const csp = buildContentSecurityPolicy({ nonce: "abc", isDev: false, turnstile: false, upgradeInsecureRequests: true });
    expect(csp).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic'");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("only allows Turnstile when enabled and eval only in development", () => {
    const csp = buildContentSecurityPolicy({ nonce: "abc", isDev: true, turnstile: true, upgradeInsecureRequests: false });
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("frame-src https://challenges.cloudflare.com");
    expect(csp).not.toContain("upgrade-insecure-requests");
  });
});
