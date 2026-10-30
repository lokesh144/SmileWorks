import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getServerEnv } from "@/lib/env";

const globalForPrisma = globalThis as unknown as { smileworksPrisma?: PrismaClient };

/**
 * Returns a shared Prisma client, or null when DATABASE_URL is not set.
 * All queries go through Prisma's parameterized query builder or tagged
 * `$queryRaw` templates — never string-concatenated SQL.
 */
export function getDb(): PrismaClient | null {
  const { DATABASE_URL } = getServerEnv();
  if (!DATABASE_URL) return null;
  if (!globalForPrisma.smileworksPrisma) {
    const adapter = new PrismaPg({ connectionString: DATABASE_URL });
    globalForPrisma.smileworksPrisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.smileworksPrisma;
}
