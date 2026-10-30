import "server-only";
import { z } from "zod";

const emptyToUndefined = (value: unknown) => (typeof value === "string" && value.trim() === "" ? undefined : value);
const optional = <T extends z.ZodType>(schema: T) => z.preprocess(emptyToUndefined, schema.optional());

const emailList = z
  .string()
  .transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean))
  .pipe(z.array(z.email()).min(1));

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: optional(z.string().regex(/^postgres(ql)?:\/\//, "DATABASE_URL must be a PostgreSQL connection string")),
  RESEND_API_KEY: optional(z.string().min(10)),
  CONTACT_NOTIFICATION_EMAIL: optional(emailList),
  /** e.g. "SmileWorks Website <website@yourdomain.com>" — must be a domain verified in Resend. */
  CONTACT_FROM_EMAIL: optional(z.string().min(3).max(200)),
  TURNSTILE_SECRET_KEY: optional(z.string().min(10)),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optional(z.string().min(10)),
  /** Secret used to hash IP addresses and emails for rate limiting. */
  RATE_LIMIT_SALT: optional(z.string().min(16)),
  /** Only enable when running behind a proxy that overwrites X-Forwarded-* headers. */
  TRUST_PROXY_HEADERS: optional(z.enum(["true", "false"])),
  /** Extra origins allowed to POST to the enquiry endpoint (comma-separated). */
  ALLOWED_ORIGINS: optional(z.string()),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // Report variable names only — never values.
    const names = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid server environment configuration: ${names}`);
  }
  cached = parsed.data;
  return cached;
}

/** Test helper — clears memoized configuration. */
export function resetServerEnvCache() {
  cached = undefined;
}

export function getDeliveryConfig(env: ServerEnv = getServerEnv()) {
  const email =
    env.RESEND_API_KEY && env.CONTACT_NOTIFICATION_EMAIL && env.CONTACT_FROM_EMAIL
      ? { apiKey: env.RESEND_API_KEY, to: env.CONTACT_NOTIFICATION_EMAIL, from: env.CONTACT_FROM_EMAIL }
      : null;
  const turnstile =
    env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? { secretKey: env.TURNSTILE_SECRET_KEY } : null;
  return {
    database: Boolean(env.DATABASE_URL),
    email,
    turnstile,
    isProduction: env.NODE_ENV === "production",
  };
}
