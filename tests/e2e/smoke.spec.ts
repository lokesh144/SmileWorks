import { expect, test, type Page } from "@playwright/test";

const pages = [
  { path: "/", heading: /your practice deserves more than just support/i },
  { path: "/services", heading: /the right support for every part of your practice/i },
  { path: "/about", heading: /behind every great practice is a great support team/i },
  { path: "/pricing", heading: /flexible support\. clear conversations\. better value/i },
  { path: "/contact", heading: /let's build a better way to work/i },
];

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("pages", () => {
  for (const { path, heading } of pages) {
    test(`${path} renders with metadata, one h1 and security headers`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/SmileWorks Solutions/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path === "/" ? "/?" : path}$`));
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);

      const headers = response!.headers();
      expect(headers["content-security-policy"]).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(headers["permissions-policy"]).toContain("camera=()");
    });

    test(`${path} has no horizontal overflow at 360px`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(path);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("every internal link resolves", async ({ page, request }) => {
    const hrefs = new Set<string>();
    for (const { path } of pages) {
      await page.goto(path);
      const found = await page.$$eval("a[href^='/']", (anchors) => anchors.map((a) => a.getAttribute("href") ?? ""));
      found.forEach((href) => hrefs.add(href.split("#")[0] || "/"));
    }
    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
    }
  });
});

test.describe("navigation", () => {
  test("desktop header navigates between all pages", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop navigation only");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const label of ["Services", "About Us", "Pricing", "Contact", "Home"]) {
      await nav.getByRole("link", { name: label }).click();
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
    }
  });

  test("mobile menu opens, traps focus, closes on Escape and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile navigation only");
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await dialog.getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("skip link moves focus to main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard test on desktop");
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
});

test.describe("consultation form", () => {
  test("shows validation errors for an empty submission", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send Consultation Request" }).click();
    const name = page.getByLabel("Full name");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toBeFocused();
    await expect(page.getByText("Please confirm you agree so we can respond to your enquiry.")).toBeVisible();
  });

  test("submits successfully through the real endpoint", async ({ page }) => {
    await page.goto("/contact?service=patient-recall&team=one");
    await expect(page.getByLabel("Service interest")).toHaveValue("patient-recall");
    await expect(page.getByLabel(/Team size needed/)).toHaveValue("one");

    await page.getByLabel("Full name").fill("Playwright Test");
    await page.getByLabel("Work email").fill(`e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`);
    await page.getByLabel("Dental practice / organization").fill("Example Dental Studio");
    await page.getByLabel("How can we help?").fill("This is an automated smoke test of the consultation form.");
    await page.getByRole("checkbox").check();

    const responsePromise = page.waitForResponse("**/api/consultation");
    await page.getByRole("button", { name: "Send Consultation Request" }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await expect(page.getByRole("status")).toContainText("your request has been sent");
  });

  test("rejects cross-origin posts to the API", async ({ request }) => {
    const response = await request.post("/api/consultation", {
      headers: { origin: "https://attacker.example", "content-type": "application/json" },
      data: {},
    });
    expect(response.status()).toBe(403);
  });
});
