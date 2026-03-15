# Implementation Plan: E-commerce Security Hardening

This plan outlines the steps to harden the AF-Gear e-commerce platform against common attacks, secure payment flows, and improve maintainability, strictly following the provided requirements.

## User Review Required

> [!IMPORTANT]
> - **Database Migration**: Ensure the `products` table has `price_cents` (integer) and `currency` columns. If not, the provided migration (`ALTER TABLE...`) must run before deploying. `orders` table needs `paid_at`.
> - **Environment Variables**: Ensure `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, and `RESEND_API_KEY` are safely stored in your deployment environment and NEVER committed (to be verified by `gitleaks`).
> - **Clerk Roles**: Admin checks will use Clerk's `publicMetadata.role === 'admin'`. You will need to manually set this role for your admin user.

## Proposed Changes

### 1. Database Schema
#### [MODIFY] [hardening.sql](file:///d:/AF-Gear-main/supabase/hardening.sql)
- Add columns to `products`: `price_cents` (integer) and `currency` (text default 'eur').
- Add column to `orders`: `paid_at` (timestamp).
- Add SQL commands to backfill `price_cents = ROUND(price * 100)`.

### 2. Payment Logic (High Priority)
#### [MODIFY] [route.ts](file:///d:/AF-Gear-main/src/app/api/checkout/route.ts)
- **Authoritative Pricing**: Implement server-side price lookup from the Supabase `products` table. Do not trust client-supplied prices.
- **Rate-Limiting**: Add a check using the new `rateLimiter.ts` utility.
- **Supabase Client**: Ensure it strictly uses the server-only `createServerSupabaseClient` utility.

#### [MODIFY] [route.ts](file:///d:/AF-Gear-main/src/app/api/webhooks/stripe/route.ts)
- **Signature Verification**: Enforce mandatory Stripe signature verification. Throw 400 on failure.
- **Idempotency**: Check if the order with `session.id` is already marked `paid` before updating.
- **Order Update**: Update status to `paid` and set the `paid_at` timestamp.

### 3. Access Control & Admin Security
#### [MODIFY] [admin.ts](file:///d:/AF-Gear-main/src/utils/supabase/admin.ts)
- Ensure the client guarantees it's running server-side (using `createClient` from `@supabase/supabase-js` without browser envs creeping in) and throws an explicit error if `SUPABASE_SERVICE_ROLE_KEY` is missing.

#### [MODIFY] [Navbar.tsx](file:///d:/AF-Gear-main/src/components/ui/Navbar.tsx)
- Replace hardcoded `govindtriapthi3@gmail.com` check with `user?.publicMetadata?.role === 'admin'`.

#### [MODIFY] [AuthButtons.tsx](file:///d:/AF-Gear-main/src/components/ui/AuthButtons.tsx)
- Replace hardcoded email check with `user?.publicMetadata?.role === 'admin'`.

### 4. Utilities & Website Security
#### [NEW] [rateLimiter.ts](file:///d:/AF-Gear-main/src/utils/rateLimiter.ts)
- Implement an in-memory windowed counter to prevent abuse (e.g., max 10 requests per minute per IP).

#### [MODIFY] [email.ts](file:///d:/AF-Gear-main/src/utils/email.ts)
- Add an `escapeHtml` helper function to sanitize user input (like customer names or item titles) before injecting them into HTML templates to prevent injection.

#### [MODIFY] [next.config.ts](file:///d:/AF-Gear-main/next.config.ts)
- Review and ensure security headers (CSP, X-Frame-Options, STS) are properly configured as per recommendations.

### 5. Repo Hygiene & CI/CD
#### [MODIFY] [.gitleaks.toml](file:///d:/AF-Gear-main/.gitleaks.toml) (or [NEW] if missing)
- Configure rules to detect `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, and `RESEND_API_KEY`.

#### [MODIFY] [.github/workflows/security.yml](file:///d:/AF-Gear-main/.github/workflows/security.yml) (or create if needed)
- Add a CI job step to run `gitleaks detect`.
- Add a step to run `npm audit --audit-level=moderate`.

## Verification Plan

### Automated Tests/Simulations
1.  **Tampered Price Simulation**: Run a `curl` POST to `/api/checkout` sending an item with `price: 0`. The server must charge the canonical DB price instead.
2.  **Webhook Simulation (Bad Signature)**: Send a `curl` POST to `/api/webhooks/stripe` with `stripe-signature: bad`. It must return 400.
3.  **Webhook Simulation (Good Signature)**: Test using `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and `stripe trigger checkout.session.completed`.
4.  **Repo Hygiene**: Run `npx gitleaks detect --source .` and `npm audit --audit-level=moderate` locally.

### Final Checklist Before Deploy
- [ ] Apply all code changes.
- [ ] Ensure secrets are in deployment environment variables and not committed.
- [ ] Update `products` table to use `price_cents`.
- [ ] Run audits (`npm audit`, `gitleaks`).
- [ ] Run `next build` to verify no server runtime errors.
- [ ] Provide a final summary report without pushing to github or running the dev server.
