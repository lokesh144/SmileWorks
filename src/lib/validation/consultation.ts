import { z } from "zod";
import { services } from "@/data/services";

export const LIMITS = {
  fullName: { min: 2, max: 100 },
  email: { max: 254 },
  phone: { max: 30 },
  organization: { min: 2, max: 150 },
  message: { min: 20, max: 2000 },
} as const;

export const serviceInterestOptions = [
  ...services.map((service) => ({ value: service.id, label: service.title })),
  { value: "multiple", label: "Multiple services" },
  { value: "not-sure", label: "Not sure yet — I'd like advice" },
] as const satisfies ReadonlyArray<{ value: string; label: string }>;

export const teamSizeOptions = [
  { value: "part-time", label: "Part-time or task-based support" },
  { value: "one", label: "1 dedicated team member" },
  { value: "multiple", label: "2 or more team members" },
  { value: "unsure", label: "Not sure yet" },
] as const;

const serviceValues = serviceInterestOptions.map((option) => option.value);
const teamSizeValues = teamSizeOptions.map((option) => option.value);

// Control characters other than tab/newline are never legitimate in form input.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const LINE_BREAKS = /[\r\n]/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,30}$/;

const singleLine = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`)
    .refine((value) => !CONTROL_CHARS.test(value) && !LINE_BREAKS.test(value), `${label} contains invalid characters.`);

export const consultationSchema = z.object({
  fullName: singleLine("Full name", LIMITS.fullName.min, LIMITS.fullName.max),
  email: z
    .string()
    .trim()
    .max(LIMITS.email.max, "Email address is too long.")
    .pipe(z.email("Enter a valid work email address.")),
  phone: z
    .string()
    .trim()
    .max(LIMITS.phone.max, `Phone number must be ${LIMITS.phone.max} characters or fewer.`)
    .refine((value) => value === "" || PHONE_PATTERN.test(value), "Enter a valid phone number, or leave this blank."),
  organization: singleLine("Practice or organization", LIMITS.organization.min, LIMITS.organization.max),
  serviceInterest: z
    .string()
    .refine((value) => (serviceValues as ReadonlyArray<string>).includes(value), "Select the service you're interested in."),
  teamSize: z
    .string()
    .refine((value) => value === "" || (teamSizeValues as ReadonlyArray<string>).includes(value), "Select a valid option."),
  message: z
    .string()
    .trim()
    .min(LIMITS.message.min, `Please share a little more detail (at least ${LIMITS.message.min} characters).`)
    .max(LIMITS.message.max, `Message must be ${LIMITS.message.max} characters or fewer.`)
    .refine((value) => !CONTROL_CHARS.test(value), "Message contains invalid characters."),
  consent: z.boolean().refine((value) => value, "Please confirm you agree so we can respond to your enquiry."),
});

export type ConsultationFormValues = z.input<typeof consultationSchema>;

/**
 * Server-side request schema: strict (unknown keys are rejected to prevent
 * mass assignment) and includes the anti-spam fields.
 */
export const consultationRequestSchema = z.strictObject({
  ...consultationSchema.shape,
  /** Honeypot — must stay empty. */
  website: z.string().max(200).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

export type ConsultationRequest = z.output<typeof consultationRequestSchema>;

export type NormalizedEnquiry = {
  fullName: string;
  email: string;
  phone: string | null;
  organization: string;
  serviceInterest: string;
  teamSize: string | null;
  message: string;
};

export function normalizeEnquiry(data: ConsultationRequest): NormalizedEnquiry {
  return {
    fullName: data.fullName.replace(/\s+/g, " "),
    email: data.email.toLowerCase(),
    phone: data.phone ? data.phone.replace(/\s+/g, " ") : null,
    organization: data.organization.replace(/\s+/g, " "),
    serviceInterest: data.serviceInterest,
    teamSize: data.teamSize || null,
    message: data.message.replace(/\r\n?/g, "\n"),
  };
}

export function labelForService(value: string): string {
  return serviceInterestOptions.find((option) => option.value === value)?.label ?? value;
}

export function labelForTeamSize(value: string | null): string {
  if (!value) return "Not specified";
  return teamSizeOptions.find((option) => option.value === value)?.label ?? value;
}

export function isServiceInterest(value: string | undefined): value is string {
  return !!value && (serviceValues as ReadonlyArray<string>).includes(value);
}

export function isTeamSize(value: string | undefined): value is string {
  return !!value && (teamSizeValues as ReadonlyArray<string>).includes(value);
}

/** Shape of JSON responses from POST /api/consultation. */
export type ConsultationResponse =
  | { ok: true; mode: "delivered" | "development" }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ConsultationFormValues, string>> };
