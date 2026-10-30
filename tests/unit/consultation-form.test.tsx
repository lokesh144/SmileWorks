// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConsultationForm } from "@/components/forms/consultation-form";

afterEach(cleanup);

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), "Alex Morgan");
  await user.type(screen.getByLabelText(/work email/i), "alex@example.com");
  await user.type(screen.getByLabelText(/dental practice/i), "Example Family Dental");
  await user.selectOptions(screen.getByLabelText(/service interest/i), "patient-recall");
  await user.type(screen.getByLabelText(/how can we help/i), "We would like help with our recall list each week.");
  await user.click(screen.getByRole("checkbox"));
}

function mockFetch(status: number, body: unknown) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }),
  );
}

describe("ConsultationForm", () => {
  it("shows accessible validation errors and does not submit an empty form", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(<ConsultationForm privacyHref="/privacy" />);

    await user.click(screen.getByRole("button", { name: /send consultation request/i }));

    const name = screen.getByLabelText(/full name/i);
    await waitFor(() => expect(name).toHaveAttribute("aria-invalid", "true"));
    expect(name).toHaveAccessibleDescription(/at least 2 characters/i);
    expect(screen.getByLabelText(/work email/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(/please confirm you agree/i)).toBeInTheDocument();
    expect(name).toHaveFocus();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("submits valid data as JSON and shows the success state", async () => {
    const fetchSpy = mockFetch(200, { ok: true, mode: "delivered" });
    const user = userEvent.setup();
    render(<ConsultationForm privacyHref="/privacy" defaultTeamSize="one" />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send consultation request/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/your request has been sent/i);
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/consultation");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      fullName: "Alex Morgan",
      email: "alex@example.com",
      serviceInterest: "patient-recall",
      teamSize: "one",
      consent: true,
      website: "",
    });
    expect(screen.queryByText(/development mode/i)).not.toBeInTheDocument();
  });

  it("clearly labels simulated development delivery", async () => {
    mockFetch(200, { ok: true, mode: "development" });
    const user = userEvent.setup();
    render(<ConsultationForm privacyHref="/privacy" />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send consultation request/i }));
    expect(await screen.findByText(/development mode/i)).toBeInTheDocument();
  });

  it("shows server field errors and a generic alert", async () => {
    mockFetch(422, { ok: false, error: "Please check the highlighted fields and try again.", fieldErrors: { email: "Enter a valid work email address." } });
    const user = userEvent.setup();
    render(<ConsultationForm privacyHref="/privacy" />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send consultation request/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/check the highlighted fields/i);
    expect(screen.getByLabelText(/work email/i)).toHaveAccessibleDescription(/enter a valid work email/i);
  });

  it("handles network failures without claiming success", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    const user = userEvent.setup();
    render(<ConsultationForm privacyHref="/privacy" />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send consultation request/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't reach our server/i);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("pre-selects a valid service passed from a CTA", () => {
    render(<ConsultationForm privacyHref="/privacy" defaultService="billing-insurance" />);
    expect(screen.getByLabelText(/service interest/i)).toHaveValue("billing-insurance");
  });
});
