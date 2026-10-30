"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type BaseSyntheticEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { describedBy, FormField } from "@/components/forms/form-field";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  LIMITS,
  consultationSchema,
  serviceInterestOptions,
  teamSizeOptions,
  type ConsultationFormValues,
  type ConsultationResponse,
} from "@/lib/validation/consultation";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; mode: "delivered" | "development" }
  | { state: "error"; message: string };

const FIELD_NAMES: ReadonlyArray<keyof ConsultationFormValues> = [
  "fullName",
  "email",
  "phone",
  "organization",
  "serviceInterest",
  "teamSize",
  "message",
  "consent",
];

function honeypotValue(event?: BaseSyntheticEvent): string {
  const form = event?.target;
  if (!(form instanceof HTMLFormElement)) return "";
  const value = new FormData(form).get("website");
  return typeof value === "string" ? value : "";
}

const NETWORK_ERROR = "We couldn't reach our server. Please check your connection and try again.";

export function ConsultationForm({
  defaultService = "",
  defaultTeamSize = "",
  privacyHref,
  turnstileSiteKey,
  nonce,
  endpoint = "/api/consultation",
}: {
  defaultService?: string;
  defaultTeamSize?: string;
  privacyHref: string;
  turnstileSiteKey?: string | null;
  nonce?: string;
  endpoint?: string;
}) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      serviceInterest: defaultService,
      teamSize: defaultTeamSize,
      message: "",
      consent: false,
    },
  });

  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;
  const submitting = status.state === "submitting";
  const handleToken = useCallback((token: string) => setTurnstileToken(token), []);

  useEffect(() => {
    if (status.state === "success" || status.state === "error") resultRef.current?.focus();
  }, [status]);

  async function onSubmit(values: ConsultationFormValues, event?: BaseSyntheticEvent) {
    if (turnstileSiteKey && !turnstileToken) {
      setStatus({ state: "error", message: "Please complete the verification check before sending." });
      return;
    }
    setStatus({ state: "submitting" });

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypotValue(event),
          ...(turnstileSiteKey ? { turnstileToken } : {}),
        }),
      });
    } catch {
      setStatus({ state: "error", message: NETWORK_ERROR });
      return;
    }

    let result: ConsultationResponse | null = null;
    try {
      result = (await response.json()) as ConsultationResponse;
    } catch {
      result = null;
    }

    if (response.ok && result?.ok) {
      setStatus({ state: "success", mode: result.mode });
      reset();
      return;
    }

    if (result && !result.ok && result.fieldErrors) {
      for (const name of FIELD_NAMES) {
        const message = result.fieldErrors[name];
        if (message) setError(name, { type: "server", message }, { shouldFocus: true });
      }
    }
    if (turnstileSiteKey) setTurnstileReset((count) => count + 1);
    setStatus({
      state: "error",
      message: result && !result.ok ? result.error : "Something went wrong while sending your request. Please try again shortly.",
    });
  }

  if (status.state === "success") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="rounded-3xl border border-line bg-white p-8 text-center outline-none md:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold text-ink">
          <CircleCheck aria-hidden="true" className="size-8" strokeWidth={1.75} />
        </span>
        <h2 className="type-h3 mt-6 text-ink">Thank you — your request has been sent.</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-copy">
          We&apos;ve received your consultation request and will be in touch using the details you provided.
        </p>
        {status.mode === "development" && (
          <p className="mx-auto mt-6 max-w-md rounded-2xl border border-dashed border-ink/30 bg-paper p-4 text-left text-sm text-ink">
            <strong>Development mode:</strong> the request passed validation but was not stored or emailed because no database or
            email provider is configured. See README → &ldquo;Enquiry delivery&rdquo;.
          </p>
        )}
        <Button variant="outline" className="mt-8" onClick={() => setStatus({ state: "idle" })}>
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      aria-busy={submitting}
      aria-describedby="form-required-note"
      onSubmit={handleSubmit(onSubmit)}
      className="relative grid gap-6"
    >
      <p id="form-required-note" className="text-sm text-copy">
        Fields marked <span aria-hidden="true" className="text-destructive">*</span>
        <span className="sr-only">with an asterisk</span> are required. Please do not include patient health information.
      </p>

      {status.state === "error" && (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="alert"
          className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive outline-none"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {status.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField name="fullName" label="Full name" required error={errors.fullName?.message}>
          <Input
            autoComplete="name"
            maxLength={LIMITS.fullName.max}
            aria-required="true"
            {...describedBy("fullName", { error: errors.fullName?.message })}
            {...register("fullName")}
          />
        </FormField>
        <FormField name="email" label="Work email" required error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email.max}
            aria-required="true"
            {...describedBy("email", { error: errors.email?.message })}
            {...register("email")}
          />
        </FormField>
        <FormField name="phone" label="Phone" error={errors.phone?.message}>
          <Input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={LIMITS.phone.max}
            {...describedBy("phone", { error: errors.phone?.message })}
            {...register("phone")}
          />
        </FormField>
        <FormField name="organization" label="Dental practice / organization" required error={errors.organization?.message}>
          <Input
            autoComplete="organization"
            maxLength={LIMITS.organization.max}
            aria-required="true"
            {...describedBy("organization", { error: errors.organization?.message })}
            {...register("organization")}
          />
        </FormField>
        <FormField name="serviceInterest" label="Service interest" required error={errors.serviceInterest?.message}>
          <NativeSelect aria-required="true" {...describedBy("serviceInterest", { error: errors.serviceInterest?.message })} {...register("serviceInterest")}>
            <option value="" disabled>
              Select a service
            </option>
            {serviceInterestOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField name="teamSize" label="Team size needed" error={errors.teamSize?.message}>
          <NativeSelect {...describedBy("teamSize", { error: errors.teamSize?.message })} {...register("teamSize")}>
            <option value="">Select an option</option>
            {teamSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </FormField>
      </div>

      <FormField
        name="message"
        label="How can we help?"
        required
        error={errors.message?.message}
        hint={`Tell us about your practice and the support you're looking for. ${messageLength}/${LIMITS.message.max} characters.`}
      >
        <Textarea
          rows={6}
          maxLength={LIMITS.message.max}
          aria-required="true"
          {...describedBy("message", { hasHint: true, error: errors.message?.message })}
          {...register("message")}
        />
      </FormField>

      {/* Honeypot: hidden from people and assistive technology; bots tend to fill it. */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]">
        <label htmlFor="field-website">Website</label>
        <input id="field-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-2">
        <div className="flex gap-3">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-input accent-ink"
            aria-required="true"
            {...describedBy("consent", { error: errors.consent?.message })}
            {...register("consent")}
          />
          <label htmlFor="field-consent" className="text-sm leading-relaxed text-ink">
            I agree that SmileWorks Solutions may use the details in this form to respond to my enquiry, as described in the{" "}
            <Link href={privacyHref} className="font-semibold underline decoration-gold decoration-2 underline-offset-4 hover:decoration-ink">
              Privacy Notice
            </Link>
            .<span aria-hidden="true" className="ml-1 text-destructive">*</span>
          </label>
        </div>
        {errors.consent?.message && (
          <p id="field-consent-error" className="flex items-start gap-1.5 pl-8 text-sm font-medium text-destructive">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {errors.consent.message}
          </p>
        )}
      </div>

      {turnstileSiteKey && (
        <TurnstileWidget siteKey={turnstileSiteKey} nonce={nonce} onToken={handleToken} resetSignal={turnstileReset} />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? (
            <>
              <LoaderCircle aria-hidden="true" className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send Consultation Request
              <Send aria-hidden="true" />
            </>
          )}
        </Button>
        <p aria-live="polite" className="text-sm text-copy">
          {submitting ? "Sending your request…" : ""}
        </p>
      </div>
    </form>
  );
}
