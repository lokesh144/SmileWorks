import "server-only";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/escape-html";
import { labelForService, labelForTeamSize, type NormalizedEnquiry } from "@/lib/validation/consultation";

export type NotificationContent = { subject: string; html: string; text: string };

/**
 * Builds the internal notification email. Every user-supplied value is
 * HTML-escaped; the subject only contains validated single-line values.
 */
export function buildEnquiryNotification(enquiry: NormalizedEnquiry, reference: string): NotificationContent {
  const rows: Array<[string, string]> = [
    ["Name", enquiry.fullName],
    ["Work email", enquiry.email],
    ["Phone", enquiry.phone ?? "Not provided"],
    ["Practice / organization", enquiry.organization],
    ["Service interest", labelForService(enquiry.serviceInterest)],
    ["Team size", labelForTeamSize(enquiry.teamSize)],
    ["Reference", reference],
  ];

  const subject = `New consultation request — ${enquiry.organization}`.replace(/[\r\n]+/g, " ").slice(0, 180);

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 16px 6px 0;color:#4a4a45;font-weight:600;vertical-align:top">${escapeHtml(label)}</th><td style="padding:6px 0;color:#111111">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const htmlMessage = escapeHtml(enquiry.message).replace(/\n/g, "<br>");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f8f8f6;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e3e3de">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#4a4a45">SmileWorks Solutions</p>
<h1 style="margin:0 0 20px;font-size:20px;color:#111111">New consultation request</h1>
<table role="presentation" style="border-collapse:collapse;font-size:14px">${htmlRows}</table>
<h2 style="margin:24px 0 8px;font-size:15px;color:#111111">Message</h2>
<p style="margin:0;font-size:14px;line-height:1.6;color:#111111">${htmlMessage}</p>
</div></body></html>`;

  const text = [
    "New consultation request",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    enquiry.message,
  ].join("\n");

  return { subject, html, text };
}

export async function sendEnquiryNotification(
  config: { apiKey: string; from: string; to: ReadonlyArray<string> },
  enquiry: NormalizedEnquiry,
  reference: string,
): Promise<boolean> {
  const resend = new Resend(config.apiKey);
  const content = buildEnquiryNotification(enquiry, reference);
  const { error } = await resend.emails.send({
    from: config.from,
    to: [...config.to],
    replyTo: enquiry.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });
  return !error;
}
