import { describe, expect, it } from "vitest";
import { buildEnquiryNotification } from "@/lib/email";
import { escapeHtml } from "@/lib/escape-html";
import type { NormalizedEnquiry } from "@/lib/validation/consultation";

const enquiry: NormalizedEnquiry = {
  fullName: `<img src=x onerror="alert(1)">`,
  email: "owner@example.com",
  phone: null,
  organization: "Smile & Co <b>Dental</b>",
  serviceInterest: "billing-insurance",
  teamSize: null,
  message: "Line one\n<script>alert('x')</script>",
};

describe("escapeHtml", () => {
  it("escapes all HTML-significant characters", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe("&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;");
  });
});

describe("buildEnquiryNotification", () => {
  const content = buildEnquiryNotification(enquiry, "ref-123");

  it("never includes raw user-supplied markup in the HTML body", () => {
    expect(content.html).not.toContain("<script>");
    expect(content.html).not.toContain("<img src=x");
    expect(content.html).not.toContain("<b>Dental</b>");
    expect(content.html).toContain("&lt;script&gt;");
  });

  it("converts message line breaks to <br> after escaping", () => {
    expect(content.html).toContain("Line one<br>&lt;script&gt;");
  });

  it("uses human-readable labels and fallbacks", () => {
    expect(content.text).toContain("Service interest: Dental Billing & Insurance Coordination");
    expect(content.text).toContain("Phone: Not provided");
    expect(content.text).toContain("Team size: Not specified");
  });

  it("produces a single-line subject", () => {
    expect(content.subject).not.toMatch(/[\r\n]/);
    expect(content.subject.length).toBeLessThanOrEqual(180);
  });
});
