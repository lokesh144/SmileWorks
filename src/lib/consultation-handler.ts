import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { getDb } from "@/lib/db";
import { sendEnquiryNotification } from "@/lib/email";
import { getDeliveryConfig, getServerEnv, type ServerEnv } from "@/lib/env";
import { errorName, logger } from "@/lib/logger";
import { checkRateLimit, getRateLimitStore, hashIdentifier, type RateLimitRule } from "@/lib/rate-limit";
import {
  RequestGuardError,
  assertJsonContentType,
  assertSameOrigin,
  getClientIp,
  parseJson,
  readBodyWithLimit,
} from "@/lib/request-guard";
import { verifyTurnstileToken } from "@/lib/turnstile";
import {
  consultationRequestSchema,
  normalizeEnquiry,
  type ConsultationFormValues,
  type ConsultationResponse,
} from "@/lib/validation/consultation";

export const MAX_BODY_BYTES = 16 * 1024;

const TEN_MINUTES = 10 * 60 * 1000;
export const RATE_LIMITS = {
  perIp: { name: "enquiry-ip", limit: 5, windowMs: TEN_MINUTES },
  /** Shared bucket used when the client IP cannot be determined safely. */
  unknownIp: { name: "enquiry-anon", limit: 40, windowMs: TEN_MINUTES },
  perEmail: { name: "enquiry-email", limit: 3, windowMs: 60 * 60 * 1000 },
} satisfies Record<string, RateLimitRule>;

const GENERIC_ERROR = "Something went wrong while sending your request. Please try again shortly.";

// Used only when RATE_LIMIT_SALT is not configured; not shared between instances.
const processSalt = randomBytes(32).toString("hex");

function respond(status: number, body: ConsultationResponse, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function allowedOrigins(env: ServerEnv): string[] {
  const origins = new Set<string>([siteConfig.url.origin]);
  for (const value of env.ALLOWED_ORIGINS?.split(",") ?? []) {
    try {
      origins.add(new URL(value.trim()).origin);
    } catch {
      // Ignore malformed entries.
    }
  }
  return [...origins];
}

export async function handleConsultationRequest(request: Request): Promise<Response> {
  const requestId = randomUUID();

  let env: ServerEnv;
  try {
    env = getServerEnv();
  } catch (error) {
    logger.error("enquiry.config_invalid", { requestId, error: errorName(error) });
    return respond(503, { ok: false, error: GENERIC_ERROR });
  }

  const delivery = getDeliveryConfig(env);
  const trustProxyHeaders = env.TRUST_PROXY_HEADERS === "true";
  const salt = env.RATE_LIMIT_SALT ?? processSalt;

  try {
    assertJsonContentType(request.headers);
    assertSameOrigin(request.headers, { allowedOrigins: allowedOrigins(env), trustProxyHeaders });

    const store = getRateLimitStore();
    const clientIp = getClientIp(request.headers, trustProxyHeaders);
    const ipLimit = clientIp
      ? await checkRateLimit(store, RATE_LIMITS.perIp, hashIdentifier(clientIp, salt))
      : await checkRateLimit(store, RATE_LIMITS.unknownIp, "shared");
    if (!ipLimit.allowed) {
      logger.warn("enquiry.rate_limited", { requestId, scope: "ip" });
      return respond(
        429,
        { ok: false, error: "Too many requests. Please wait a few minutes and try again." },
        { "Retry-After": String(ipLimit.retryAfterSeconds) },
      );
    }

    const body = parseJson(await readBodyWithLimit(request, MAX_BODY_BYTES));
    const parsed = consultationRequestSchema.safeParse(body);
    if (!parsed.success) {
      const flattened = z.flattenError(parsed.error);
      const fieldErrors: Partial<Record<keyof ConsultationFormValues, string>> = {};
      for (const [field, messages] of Object.entries(flattened.fieldErrors) as Array<[string, string[] | undefined]>) {
        if (field in consultationRequestSchema.shape && messages?.[0] && field !== "website" && field !== "turnstileToken") {
          fieldErrors[field as keyof ConsultationFormValues] = messages[0];
        }
      }
      return respond(422, { ok: false, error: "Please check the highlighted fields and try again.", fieldErrors });
    }

    if (parsed.data.website) {
      // Honeypot filled in: silently discard without storing or notifying.
      logger.warn("enquiry.honeypot_triggered", { requestId });
      return respond(200, { ok: true, mode: "delivered" });
    }

    const enquiry = normalizeEnquiry(parsed.data);

    const emailLimit = await checkRateLimit(store, RATE_LIMITS.perEmail, hashIdentifier(enquiry.email, salt));
    if (!emailLimit.allowed) {
      logger.warn("enquiry.rate_limited", { requestId, scope: "email" });
      return respond(
        429,
        { ok: false, error: "We've already received several requests from this email. We'll be in touch soon." },
        { "Retry-After": String(emailLimit.retryAfterSeconds) },
      );
    }

    if (delivery.turnstile) {
      const verified = await verifyTurnstileToken(parsed.data.turnstileToken, delivery.turnstile.secretKey, clientIp);
      if (!verified) {
        logger.warn("enquiry.turnstile_failed", { requestId });
        return respond(400, { ok: false, error: "We couldn't verify your submission. Please complete the check and try again." });
      }
    }

    const db = getDb();

    if (!db && !delivery.email) {
      if (delivery.isProduction) {
        logger.error("enquiry.delivery_not_configured", { requestId });
        return respond(503, { ok: false, error: GENERIC_ERROR });
      }
      // Development only: nothing is stored or sent.
      logger.info("enquiry.simulated_development_delivery", { requestId, service: enquiry.serviceInterest });
      return respond(200, { ok: true, mode: "development" });
    }

    if (db) {
      let record: { id: string };
      try {
        record = await db.enquiry.create({
          data: {
            fullName: enquiry.fullName,
            email: enquiry.email,
            phone: enquiry.phone,
            organization: enquiry.organization,
            serviceInterest: enquiry.serviceInterest,
            teamSize: enquiry.teamSize,
            message: enquiry.message,
            consentGivenAt: new Date(),
            notificationStatus: delivery.email ? "PENDING" : "NOT_CONFIGURED",
          },
          select: { id: true },
        });
      } catch (error) {
        logger.error("enquiry.store_failed", { requestId, error: errorName(error) });
        return respond(500, { ok: false, error: GENERIC_ERROR });
      }

      if (delivery.email) {
        let sent = false;
        try {
          sent = await sendEnquiryNotification(delivery.email, enquiry, record.id);
        } catch (error) {
          logger.error("enquiry.notify_error", { requestId, error: errorName(error) });
        }
        if (!sent) logger.error("enquiry.notify_failed", { requestId, enquiryId: record.id });
        await db.enquiry
          .update({ where: { id: record.id }, data: { notificationStatus: sent ? "SENT" : "FAILED" } })
          .catch((error: unknown) => logger.error("enquiry.status_update_failed", { requestId, error: errorName(error) }));
      }

      logger.info("enquiry.stored", { requestId, enquiryId: record.id });
      return respond(200, { ok: true, mode: "delivered" });
    }

    // Email-only configuration: success depends on the provider accepting the message.
    const emailConfig = delivery.email;
    if (!emailConfig) return respond(503, { ok: false, error: GENERIC_ERROR });
    let sent = false;
    try {
      sent = await sendEnquiryNotification(emailConfig, enquiry, requestId);
    } catch (error) {
      logger.error("enquiry.notify_error", { requestId, error: errorName(error) });
    }
    if (!sent) {
      logger.error("enquiry.notify_failed", { requestId });
      return respond(502, { ok: false, error: GENERIC_ERROR });
    }
    logger.info("enquiry.emailed", { requestId });
    return respond(200, { ok: true, mode: "delivered" });
  } catch (error) {
    if (error instanceof RequestGuardError) {
      return respond(error.status, { ok: false, error: error.publicMessage });
    }
    logger.error("enquiry.unhandled_error", { requestId, error: errorName(error) });
    return respond(500, { ok: false, error: GENERIC_ERROR });
  }
}
