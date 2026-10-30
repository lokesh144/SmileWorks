import { beforeEach, describe, expect, it, vi } from "vitest";
import { validValues } from "../support/fixtures";

const createEnquiry = vi.fn();
const updateEnquiry = vi.fn();
const sendNotification = vi.fn();
let dbEnabled = false;

const rateLimitCounts = new Map<string, number>();
const queryRaw = vi.fn(async (_strings: TemplateStringsArray, key: string, windowStart: Date) => {
  const bucket = `${key}:${windowStart.getTime()}`;
  const count = (rateLimitCounts.get(bucket) ?? 0) + 1;
  rateLimitCounts.set(bucket, count);
  return [{ count }];
});

vi.mock("@/lib/db", () => ({
  getDb: () =>
    dbEnabled
      ? {
          enquiry: { create: createEnquiry, update: updateEnquiry },
          $queryRaw: queryRaw,
          $executeRaw: vi.fn().mockResolvedValue(0),
        }
      : null,
}));

vi.mock("@/lib/email", () => ({
  sendEnquiryNotification: (...args: unknown[]) => sendNotification(...args),
}));

const { handleConsultationRequest } = await import("@/lib/consultation-handler");
const { resetServerEnvCache } = await import("@/lib/env");

let ipCounter = 0;

function request(body: unknown, init: { headers?: Record<string, string>; raw?: string } = {}) {
  ipCounter += 1;
  return new Request("http://localhost:3000/api/consultation", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:3000",
      host: "localhost:3000",
      "x-forwarded-for": `198.51.100.${ipCounter % 250}`,
      ...init.headers,
    },
    body: init.raw ?? JSON.stringify(body),
  });
}

const uniqueEmail = () => `owner${ipCounter}-${Math.random().toString(36).slice(2)}@example.com`;

beforeEach(() => {
  resetServerEnvCache();
  dbEnabled = false;
  createEnquiry.mockReset().mockResolvedValue({ id: "enq_1" });
  updateEnquiry.mockReset().mockResolvedValue({});
  sendNotification.mockReset().mockResolvedValue(true);
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("TRUST_PROXY_HEADERS", "true");
  vi.stubEnv("RATE_LIMIT_SALT", "test-salt-0123456789");
  vi.stubEnv("DATABASE_URL", "");
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("CONTACT_NOTIFICATION_EMAIL", "");
  vi.stubEnv("CONTACT_FROM_EMAIL", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

function configureEmail() {
  vi.stubEnv("RESEND_API_KEY", "re_test_1234567890");
  vi.stubEnv("CONTACT_NOTIFICATION_EMAIL", "team@example.com");
  vi.stubEnv("CONTACT_FROM_EMAIL", "Website <website@example.com>");
}

describe("POST /api/consultation", () => {
  it("simulates delivery outside production when nothing is configured", async () => {
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail() }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, mode: "development" });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("refuses to report success in production when delivery is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail() }));
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.ok).toBe(false);
  });

  it("stores only whitelisted fields when a database is configured", async () => {
    dbEnabled = true;
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail() }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, mode: "delivered" });
    const data = createEnquiry.mock.calls[0][0].data;
    expect(Object.keys(data).sort()).toEqual(
      ["consentGivenAt", "email", "fullName", "message", "notificationStatus", "organization", "phone", "serviceInterest", "teamSize"].sort(),
    );
    expect(data.notificationStatus).toBe("NOT_CONFIGURED");
    // Rate limits use the shared Postgres store, keyed by hashes rather than raw identifiers.
    expect(queryRaw).toHaveBeenCalled();
    const keys = queryRaw.mock.calls.map((call) => String(call[1]));
    expect(keys.every((key) => !key.includes("@") && !key.includes("198.51.100"))).toBe(true);
  });

  it("still succeeds when stored but the notification email fails, recording the failure", async () => {
    dbEnabled = true;
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
    configureEmail();
    sendNotification.mockResolvedValue(false);
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail() }));
    expect(response.status).toBe(200);
    expect(updateEnquiry).toHaveBeenCalledWith({ where: { id: "enq_1" }, data: { notificationStatus: "FAILED" } });
  });

  it("returns a generic error when the database write fails", async () => {
    dbEnabled = true;
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
    createEnquiry.mockRejectedValue(new Error("connection refused at 10.0.0.5"));
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail() }));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain("10.0.0.5");
  });

  it("fails when email is the only delivery channel and sending fails", async () => {
    configureEmail();
    sendNotification.mockResolvedValue(false);
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail() }));
    expect(response.status).toBe(502);
  });

  it("succeeds when email is the only delivery channel and sending succeeds", async () => {
    configureEmail();
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail() }));
    expect(response.status).toBe(200);
    expect(sendNotification).toHaveBeenCalledOnce();
  });

  it("silently discards honeypot submissions", async () => {
    configureEmail();
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail(), website: "https://spam.test" }));
    expect(response.status).toBe(200);
    expect(sendNotification).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const response = await handleConsultationRequest(request({ ...validValues, email: "nope" }));
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.fieldErrors.email).toBeTruthy();
  });

  it("rejects unexpected fields", async () => {
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail(), isAdmin: true }));
    expect(response.status).toBe(422);
  });

  it("rejects wrong content types, foreign origins, malformed JSON and oversized bodies", async () => {
    expect((await handleConsultationRequest(request(validValues, { headers: { "content-type": "text/plain" } }))).status).toBe(415);
    expect((await handleConsultationRequest(request(validValues, { headers: { origin: "https://evil.test" } }))).status).toBe(403);
    expect((await handleConsultationRequest(request(null, { raw: "{not json" }))).status).toBe(400);
    expect((await handleConsultationRequest(request(null, { raw: JSON.stringify({ message: "x".repeat(20_000) }) }))).status).toBe(413);
  });

  it("rate limits repeated requests from one client", async () => {
    const headers = { "x-forwarded-for": "203.0.113.200" };
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail() }, { headers }));
      statuses.push(response.status);
    }
    expect(statuses.slice(0, 5).every((status) => status === 200)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  it("requires a valid Turnstile token when configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key-123456");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key-123456");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ success: false }));
    const response = await handleConsultationRequest(request({ ...validValues, email: uniqueEmail(), turnstileToken: "bad" }));
    expect(response.status).toBe(400);
    expect(fetchSpy).toHaveBeenCalledOnce();
  });
});
