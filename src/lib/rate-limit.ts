import "server-only";
import { createHash } from "node:crypto";
import type { PrismaClient } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import { getServerEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

export interface RateLimitStore {
  /** Atomically increments the counter for a key/window and returns the new count. */
  increment(key: string, windowStart: Date, windowMs: number): Promise<number>;
}

/**
 * Process-local store. Suitable for local development and single-instance
 * deployments only — counters are not shared between instances.
 */
export class MemoryRateLimitStore implements RateLimitStore {
  private buckets = new Map<string, { count: number; expiresAt: number }>();

  constructor(private readonly maxEntries = 10_000) {}

  async increment(key: string, windowStart: Date, windowMs: number): Promise<number> {
    const bucketKey = `${key}:${windowStart.getTime()}`;
    const existing = this.buckets.get(bucketKey);
    if (existing) {
      existing.count += 1;
      return existing.count;
    }
    if (this.buckets.size >= this.maxEntries) this.evictExpired(Date.now());
    this.buckets.set(bucketKey, { count: 1, expiresAt: windowStart.getTime() + windowMs });
    return 1;
  }

  private evictExpired(now: number) {
    for (const [key, bucket] of this.buckets) {
      if (bucket.expiresAt <= now) this.buckets.delete(key);
    }
    // Still full: drop the oldest entries rather than growing without bound.
    while (this.buckets.size >= this.maxEntries) {
      const oldest = this.buckets.keys().next().value;
      if (oldest === undefined) break;
      this.buckets.delete(oldest);
    }
  }
}

/** Shared store backed by PostgreSQL — safe for multi-instance deployments. */
export class PostgresRateLimitStore implements RateLimitStore {
  constructor(private readonly db: PrismaClient) {}

  async increment(key: string, windowStart: Date): Promise<number> {
    const rows = await this.db.$queryRaw<Array<{ count: number }>>`
      INSERT INTO "rate_limit_buckets" ("key", "window_start", "count")
      VALUES (${key}, ${windowStart}, 1)
      ON CONFLICT ("key", "window_start")
      DO UPDATE SET "count" = "rate_limit_buckets"."count" + 1
      RETURNING "count"`;

    // Opportunistic cleanup of stale buckets (~1% of requests).
    if (Math.random() < 0.01) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      this.db.$executeRaw`DELETE FROM "rate_limit_buckets" WHERE "window_start" < ${cutoff}`.catch(() => {
        logger.warn("rate_limit.cleanup_failed");
      });
    }
    return Number(rows[0]?.count ?? 1);
  }
}

let memoryStore: MemoryRateLimitStore | undefined;
let warnedAboutMemoryStore = false;

export function getRateLimitStore(): RateLimitStore {
  const db = getDb();
  if (db) return new PostgresRateLimitStore(db);

  if (getServerEnv().NODE_ENV === "production" && !warnedAboutMemoryStore) {
    warnedAboutMemoryStore = true;
    logger.warn("rate_limit.memory_store_in_production", {
      detail: "Configure DATABASE_URL so rate limits are shared across instances.",
    });
  }
  memoryStore ??= new MemoryRateLimitStore();
  return memoryStore;
}

export type RateLimitRule = { name: string; limit: number; windowMs: number };

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export async function checkRateLimit(
  store: RateLimitStore,
  rule: RateLimitRule,
  identifier: string,
  now: number = Date.now(),
): Promise<RateLimitResult> {
  const windowStartMs = Math.floor(now / rule.windowMs) * rule.windowMs;
  const count = await store.increment(`${rule.name}:${identifier}`, new Date(windowStartMs), rule.windowMs);
  if (count <= rule.limit) return { allowed: true };
  return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((windowStartMs + rule.windowMs - now) / 1000)) };
}

/** One-way salted hash so identifiers can be rate limited without being stored. */
export function hashIdentifier(value: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}
