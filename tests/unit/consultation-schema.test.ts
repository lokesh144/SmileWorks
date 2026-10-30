import { describe, expect, it } from "vitest";
import {
  consultationRequestSchema,
  consultationSchema,
  isServiceInterest,
  isTeamSize,
  normalizeEnquiry,
} from "@/lib/validation/consultation";
import { validValues } from "../support/fixtures";

describe("consultationSchema", () => {
  it("accepts a complete, valid enquiry", () => {
    expect(consultationSchema.safeParse(validValues).success).toBe(true);
  });

  it("accepts blank optional fields", () => {
    const result = consultationSchema.safeParse({ ...validValues, phone: "", teamSize: "" });
    expect(result.success).toBe(true);
  });

  it.each([
    ["fullName", ""],
    ["email", "not-an-email"],
    ["organization", "A"],
    ["serviceInterest", ""],
    ["message", "Too short"],
  ])("rejects an invalid %s", (field, value) => {
    const result = consultationSchema.safeParse({ ...validValues, [field]: value });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true);
  });

  it("requires consent", () => {
    expect(consultationSchema.safeParse({ ...validValues, consent: false }).success).toBe(false);
  });

  it("rejects unknown service and team-size values", () => {
    expect(consultationSchema.safeParse({ ...validValues, serviceInterest: "clinical-treatment" }).success).toBe(false);
    expect(consultationSchema.safeParse({ ...validValues, teamSize: "50" }).success).toBe(false);
  });

  it("rejects malformed phone numbers", () => {
    expect(consultationSchema.safeParse({ ...validValues, phone: "call me maybe" }).success).toBe(false);
  });

  it("rejects line breaks and control characters in single-line fields (header injection)", () => {
    expect(consultationSchema.safeParse({ ...validValues, organization: "Clinic\r\nBcc: x@y.z" }).success).toBe(false);
    expect(consultationSchema.safeParse({ ...validValues, fullName: "Alex\u0000" }).success).toBe(false);
  });

  it("enforces maximum lengths", () => {
    expect(consultationSchema.safeParse({ ...validValues, message: "x".repeat(2001) }).success).toBe(false);
    expect(consultationSchema.safeParse({ ...validValues, fullName: "x".repeat(101) }).success).toBe(false);
  });
});

describe("consultationRequestSchema", () => {
  it("rejects unexpected keys (mass assignment protection)", () => {
    const result = consultationRequestSchema.safeParse({ ...validValues, notificationStatus: "SENT", id: "abc" });
    expect(result.success).toBe(false);
  });

  it("accepts honeypot and turnstile fields", () => {
    const result = consultationRequestSchema.safeParse({ ...validValues, website: "", turnstileToken: "token" });
    expect(result.success).toBe(true);
  });
});

describe("normalizeEnquiry", () => {
  it("trims, lowercases email and converts blanks to null", () => {
    const parsed = consultationRequestSchema.parse({ ...validValues, phone: "", teamSize: "", fullName: "  Alex   Morgan " });
    const enquiry = normalizeEnquiry(parsed);
    expect(enquiry.email).toBe("alex.morgan@example-dental.com");
    expect(enquiry.fullName).toBe("Alex Morgan");
    expect(enquiry.phone).toBeNull();
    expect(enquiry.teamSize).toBeNull();
  });
});

describe("query parameter guards", () => {
  it("only accepts known values", () => {
    expect(isServiceInterest("patient-recall")).toBe(true);
    expect(isServiceInterest("<script>")).toBe(false);
    expect(isTeamSize("multiple")).toBe(true);
    expect(isTeamSize(undefined)).toBe(false);
  });
});
