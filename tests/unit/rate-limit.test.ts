import { describe, expect, it } from "vitest";
import { MemoryRateLimitStore, checkRateLimit, hashIdentifier } from "@/lib/rate-limit";

const rule = { name: "test", limit: 3, windowMs: 60_000 };

describe("checkRateLimit", () => {
  it("allows requests up to the limit, then blocks with Retry-After", async () => {
    const store = new MemoryRateLimitStore();
    const now = 1_000_000_020_000;
    for (let i = 0; i < 3; i++) {
      expect((await checkRateLimit(store, rule, "client-a", now)).allowed).toBe(true);
    }
    const blocked = await checkRateLimit(store, rule, "client-a", now);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
      expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(60);
    }
  });

  it("tracks identifiers independently", async () => {
    const store = new MemoryRateLimitStore();
    for (let i = 0; i < 4; i++) await checkRateLimit(store, rule, "client-a");
    expect((await checkRateLimit(store, rule, "client-b")).allowed).toBe(true);
  });

  it("resets in the next window", async () => {
    const store = new MemoryRateLimitStore();
    const start = 1_000_000_000_000;
    for (let i = 0; i < 4; i++) await checkRateLimit(store, rule, "client-a", start);
    expect((await checkRateLimit(store, rule, "client-a", start + rule.windowMs)).allowed).toBe(true);
  });

  it("bounds memory usage", async () => {
    const store = new MemoryRateLimitStore(5);
    for (let i = 0; i < 50; i++) await checkRateLimit(store, rule, `client-${i}`);
    expect((store as unknown as { buckets: Map<string, unknown> }).buckets.size).toBeLessThanOrEqual(5);
  });
});

describe("hashIdentifier", () => {
  it("is deterministic per salt and does not reveal the input", () => {
    const a = hashIdentifier("203.0.113.7", "salt-one-123456789");
    expect(a).toBe(hashIdentifier("203.0.113.7", "salt-one-123456789"));
    expect(a).not.toBe(hashIdentifier("203.0.113.7", "salt-two-123456789"));
    expect(a).not.toContain("203.0.113.7");
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });
});
