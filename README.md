# SmileWorks Solutions — website

Marketing website for **SmileWorks Solutions**, a dental virtual staffing and business support company.
Five public pages (Home, Services, About Us, Pricing & Process, Contact) plus a draft privacy notice, with a secure consultation-request backend.

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4, shadcn/ui (Radix) primitives, custom design tokens |
| Motion | `motion/react` (LazyMotion + `m`), CSS keyframes for above-the-fold content |
| Forms | React Hook Form + Zod (shared client/server schema) |
| Data | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) — optional |
| Email | Resend — optional |
| Spam protection | Honeypot, rate limiting (Postgres-backed), optional Cloudflare Turnstile |
| Tests | Vitest + Testing Library (unit/component), Playwright (smoke/e2e) |

---

## 1. Getting started

Requirements: Node.js 20.9+ (developed on Node 24), npm.

```bash
npm install            # also runs `prisma generate`
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

No credentials are needed for local development. Without a database or email provider the contact form runs in
**development delivery mode**: submissions are fully validated and rate limited, but **not stored or sent**, and the
success screen says so explicitly. In production this mode is disabled — the endpoint returns an error instead of
reporting a false success.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit + component tests |
| `npm run test:e2e` | Playwright smoke tests (starts `next dev` on port 3100). First run: `npx playwright install chromium` |
| `npm run verify` | lint → typecheck → unit tests → production build |
| `npm run audit:deps` | `npm audit` for production dependencies |
| `npm run db:migrate` | Apply Prisma migrations (`prisma migrate deploy`) |
| `npm run brand:extract` | Re-generate logo assets from the brand board |

---

## 2. Environment variables

All variables are documented in [`.env.example`](./.env.example). Only `NEXT_PUBLIC_*` values reach the browser and none of them are secret.

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical origin (`https://www.example.com`). Drives canonical URLs, sitemap, OG and the allowed form origin. |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` | No | Shown only when set. |
| `NEXT_PUBLIC_BOOKING_URL` | No | Genuine https booking link; hidden when blank. |
| `DATABASE_URL` | Recommended | PostgreSQL. Enables enquiry storage and shared rate limiting. |
| `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL`, `CONTACT_FROM_EMAIL` | Recommended | All three are needed for email notifications. Sender domain must be verified in Resend. |
| `RATE_LIMIT_SALT` | Production | 32+ random chars; hashes IPs/emails for rate limiting. |
| `TRUST_PROXY_HEADERS` | Deployment-specific | `true` only behind a proxy that overwrites `X-Forwarded-*`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | No | Enables Cloudflare Turnstile (both required). |
| `ALLOWED_ORIGINS` | No | Extra origins permitted to POST to the enquiry API. |

Prisma CLI commands read `.env` (via `dotenv` in `prisma.config.ts`); Next.js reads `.env.local`. Put `DATABASE_URL` in whichever your workflow uses (or export it in the shell/CI).

---

## 3. Enquiry delivery

`POST /api/consultation` (`src/lib/consultation-handler.ts`):

1. Rejects non-JSON content types (415) and requests whose `Origin` / `Sec-Fetch-Site` is not this site (403) — CSRF protection.
2. Rate limits per hashed IP (5 / 10 min) and per hashed email (3 / hour). Without trusted proxy headers a shared bucket is used.
3. Reads at most 16 KB of body (413 otherwise), parses JSON, validates with a **strict** Zod schema (unknown keys rejected).
4. Honeypot submissions are discarded silently; Turnstile tokens are verified server-side when configured.
5. Delivery rules — success is only reported when the enquiry is durably handled:

| Configuration | Behavior |
| --- | --- |
| Database (+ optional email) | Saved first; then email is attempted and its status (`SENT`/`FAILED`/`NOT_CONFIGURED`) recorded on the row. |
| Email only | Success only if Resend accepts the message (otherwise 502). |
| Neither, development | Simulated success, clearly labelled in the UI. |
| Neither, production | 503 generic error; an `enquiry.delivery_not_configured` log is written. |

Errors returned to the browser are generic; logs contain event names and IDs only — never form contents, emails or IPs.

### Database setup

```bash
# .env
DATABASE_URL="postgresql://smileworks_app:***@host:5432/smileworks?sslmode=require"
npm run db:migrate
```

The initial migration lives in `prisma/migrations`. Tables: `enquiries` and `rate_limit_buckets` (hashed keys only).
Use a least-privilege role (INSERT/UPDATE/SELECT on these tables). Decide and implement a retention period for enquiries (see section 7).

---

## 4. Deployment

**Vercel**: import the repo, set environment variables (Production + Preview), set `TRUST_PROXY_HEADERS=true`, run `npm run db:migrate` against the production database (e.g. in a release step).

**Self-hosted Node** (`npm run build && npm start`): run behind a TLS-terminating reverse proxy (Nginx, Caddy, a load balancer). Configure the proxy to **overwrite** `X-Forwarded-For`, `X-Forwarded-Host` and `X-Forwarded-Proto`, then set `TRUST_PROXY_HEADERS=true`. Also limit request bodies at the proxy (e.g. `client_max_body_size 64k;`).

Always serve over HTTPS. HSTS (`max-age=63072000; includeSubDomains`) and `upgrade-insecure-requests` are added automatically on HTTPS requests in production. Only add `preload` after confirming every subdomain supports HTTPS.

---

## 5. Security decisions

- **Strict, nonce-based CSP** (`src/proxy.ts`, `src/lib/csp.ts`): `script-src 'self' 'nonce-…' 'strict-dynamic'`, no `unsafe-eval` in production, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`. Nonces require per-request rendering, so **Cache Components / Partial Prerendering are disabled** in `next.config.ts` and the root layout reads request headers. These pages are lightweight, so the cost is small. `style-src` allows `'unsafe-inline'` because `next/image` and Motion emit inline style attributes; scripts remain fully restricted.
- **Other headers** (`next.config.ts`): `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`, `X-Frame-Options: DENY`, COOP/CORP same-origin, `poweredByHeader: false`. API routes get `default-src 'none'` and `Cache-Control: no-store`.
- **Input handling**: one Zod schema shared by client and server; length limits, control-character and line-break rejection (prevents email header injection), enum allow-lists for selects and query-string pre-fills, strict objects (no mass assignment), explicit field mapping into Prisma.
- **XSS**: React escaping everywhere; notification emails HTML-escape every user value; JSON-LD escapes `<`.
- **Injection**: Prisma query builder and tagged `$queryRaw` templates only (parameterized).
- **Abuse**: honeypot, Postgres-backed fixed-window rate limiting (works across instances; in-memory fallback logs a warning in production), optional Turnstile, 16 KB body cap.
- **Secrets**: server-only modules import `server-only`; env is validated with Zod and only variable *names* are logged on misconfiguration.
- **Outbound requests**: only `api.resend.com` (email) and `challenges.cloudflare.com` (Turnstile). `images.remotePatterns` is empty and `localPatterns` limits the optimizer to `/brand` and `/images`.
- **Server Actions**: none are used; `serverActions.allowedOrigins` is empty and the body limit is 64 KB.
- **No file uploads, no analytics, no cookies.** No admin area is included — enquiries are read directly from the database or the notification inbox.
- **Compliance**: the site does **not** claim HIPAA (or any other) compliance and the form tells visitors not to submit patient information. A formal compliance assessment is required before making any such claim.

Recommended verification before each release: `npm run verify`, `npm run audit:deps`, `npm run test:e2e`, and a header check (e.g. securityheaders.com) on the deployed URL.

---

## 6. Editing content

Everything is centralized — no need to search through components:

| What | Where |
| --- | --- |
| Company name, contact details, legal flags | `src/config/site.ts` (+ `NEXT_PUBLIC_*` env vars) |
| Navigation and CTA labels | `src/config/navigation.ts` |
| Brand colors / asset paths | `src/config/brand.ts` and tokens in `src/styles/globals.css` |
| Services (enable/disable, tasks, benefits) | `src/data/services.ts` |
| Home page copy | `src/data/home.ts` |
| About page copy, values, leadership | `src/data/about.ts` |
| Pricing factors, engagements, comparison, onboarding | `src/data/pricing.ts` |
| FAQs | `src/data/faqs.ts` |
| Testimonials (hidden while empty) | `src/data/testimonials.ts` |
| Privacy notice draft | `src/data/legal.ts` |

Disabling a service (`enabled: false`) removes it from cards, detail sections, footer, form options and structured data.

### Brand assets

The supplied brand board is stored at `brand-source/smileworks-brand-board.jpg`. `scripts/extract-brand.mjs` crops the isolated app-icon mark from it and produces:

- `public/brand/smileworks-icon.png` — rounded icon (header, footer, JSON-LD logo)
- `public/brand/smileworks-mark-light.png` / `-dark.png` — transparent marks for dark/light backgrounds
- `src/app/icon.png`, `src/app/apple-icon.png` — favicons

The wordmark is set in type (Manrope) to match the board. **These are raster derivatives of a 1024px board, not production masters.** When official vector (SVG) or high-resolution PNG logo files are available, replace the files above with the same names (or update `src/config/brand.ts`).

### Imagery

No stock or AI photos are used, and there are no fake team or client photos. Visuals are code-based illustrations built in the brand palette. To add licensed photography, place files in `public/images/` and use `next/image` with descriptive `alt` text and `sizes`.

---

## 7. Information still needed from SmileWorks Solutions

The site deliberately avoids invented facts. Please supply or confirm:

1. **Production domain** → `NEXT_PUBLIC_SITE_URL`.
2. **Public contact details** (email, phone) and a genuine **booking link**, if any.
3. **Official logo files** (SVG/PNG masters).
4. **Service scope**: confirm every task listed in `src/data/services.ts`, the hours and coverage you offer, and supported practice-management systems.
5. **Privacy notice**: legal entity name and address, privacy contact, applicable jurisdictions and legal basis, retention period, sub-processors (database host, Resend, Cloudflare), data-subject request process, effective date. Then set `privacyNoticeApproved: true` in `src/config/site.ts`.
6. Whether **terms of service** or other legal pages are required for your jurisdictions.
7. **Testimonials**: only genuine quotes with written permission.
8. **Leadership/team profiles and photos** (optional; section hidden until supplied).
9. **Social profiles** (verified URLs) for the footer and Organization schema.
10. Confirmation of the **brand-mark interpretation** on the About page ("A person, lifted by a smile").
11. Data-protection commitments described in the FAQ (access arrangements, confidentiality), so they match actual operating procedures.

---

## 8. Project structure

```
src/
  app/                    routes (/, /services, /about, /pricing, /contact, /privacy), API, metadata routes
  components/
    animations/           Motion provider, reveal/stagger, magnetic CTA, process timeline
    forms/                consultation form, field wrapper, Turnstile widget
    layout/               header, mobile drawer, footer, logo, container/section
    sections/             page sections (home, services, about, pricing, shared)
    ui/                   shadcn/ui-based primitives (button, accordion, sheet, inputs…)
  config/                 site, navigation, brand
  data/                   all editable copy
  lib/                    validation, security guards, CSP, rate limiting, email, db, SEO
  styles/globals.css      design tokens, typography scale, utilities
prisma/                   schema + migrations
tests/                    unit (Vitest) and e2e (Playwright)
```

## 9. Performance and accessibility notes

- Fonts are self-hosted through `next/font` (Manrope for headings, Inter for body text). There are no third-party requests at page load.
- Hero entrance animations are CSS-only, so the LCP heading paints without waiting for hydration. Scroll reveals use Motion's `LazyMotion` (`domAnimation`).
- All motion respects `prefers-reduced-motion`. A `<noscript>` rule keeps revealed content visible without JavaScript.
- Accessibility features: skip link, landmark navigation, `aria-current` on the active link, and a Radix dialog mobile menu (focus trap, Escape to close, focus return). The accordion uses correct ARIA state, form errors are linked with `aria-describedby`, and gold is never used for small text on light backgrounds.
- **Lighthouse scores have not been measured yet.** Run Lighthouse against a production build (`npm run build && npm start`) or the deployed URL, and record the actual results.
