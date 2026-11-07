# Project Overview

**Project:** Dasi Life (`dasi-life-website`, package version `1.0.0`)  
**Audit date:** 2026-10-25  
**Purpose evidenced by the source:** A Pakistan-oriented storefront and admin console for Dasi Life-branded Unani/herbal wellness products.  
**Audit scope:** The repository's application source, manifests, and framework configuration. No live Supabase project, database schema, deployment account, or customer data was queried.

## Executive summary

This is a TypeScript/React web application built with Next.js App Router. It combines server-rendered public catalog pages with client-side shopping interactions, Supabase Auth, direct Supabase database/storage calls, and a browser-rendered admin area. It has catalog, cart, COD order placement, account, wishlist, review, contact, and catalog/order administration surfaces.

The source alone does **not** establish that the live database, Row Level Security (RLS), Storage policies, deployment variables, or external analytics configurations are correct. There are no repository-visible migrations or generated database schema definitions. The code's “server-side” order validation is actually in a module imported by a client checkout page, and unauthenticated checkout is redirected by the root proxy despite guest checkout handling in the order service. Address those issues and verify the deployed Supabase policies before treating this as production-ready.

## Technology and architecture

| Area | Verified information |
|---|---|
| Package/project identity | `dasi-life-website`, version `1.0.0`, defined in `package.json` |
| Framework | Next.js `^16.3.6`, App Router under `app/` |
| UI | React and React DOM `^19.3.0`; server and client components |
| Language | TypeScript (`strict: true`) and JavaScript for Next/Tailwind/PostCSS configuration |
| Styling | Tailwind CSS 3, global CSS utilities, custom brand colors/fonts, responsive utility classes |
| Animation/icons | Framer Motion, Lucide React |
| Form/validation libraries | React Hook Form, Zod, `@hookform/resolvers` are dependencies; actual application files also implement several forms with component state and manual checks. No central schema-validation layer was found in the reviewed flows. |
| Backend/data platform | Supabase JavaScript client, Supabase SSR helpers, Supabase Auth, Postgres tables accessed directly from browser/server components, and Supabase Storage |
| Payment/shipping backend | No payment processor or courier API dependency/integration found. Checkout creates COD orders in source. |
| Package manager | npm, evidenced by `package-lock.json` and npm scripts in `package.json` |
| Deployment-adjacent integrations | Vercel Analytics and Speed Insights components; optional Google Analytics and Meta Pixel code; external Google/Fontshare font CSS |

### High-level architecture

- **Public storefront:** Next App Router pages read product/category/settings content from Supabase, often at build/revalidation time.
- **Interactive browser:** Header, cart, wishlist, account, checkout, tracking, contact, reviews, and admin components use client-side React and Supabase browser clients.
- **Authentication:** Supabase Auth, `@supabase/ssr` cookie clients, `proxy.ts` route gating, and a single OAuth/auth callback route.
- **Data access:** No first-party REST API or server-action layer was found. Services call Supabase tables directly.
- **Database:** External Supabase/Postgres is implied by SDK usage, table queries, and `storage.from(...)`. Actual schema and access policies are not checked into this repository.

## Configuration and environment names

The root contains `.env.local`; only variable **names** were examined. Values are intentionally omitted.

- Names present in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.
- Source references those Supabase public variables. The service-role variable name is not referenced in application/config source found in this audit. Do not expose a service-role key to browser code.
- Source also conditionally reads `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_META_PIXEL_ID`; those names were not among the names read from the local `.env.local`. They could still be provided in another deployment environment; that is unverified.
- `next.config.js` configures image hosts, production console stripping, package import optimization, compression, and other build behavior. `tailwind.config.js`, `postcss.config.js`, and `tsconfig.json` configure styling/build tooling.

## Not verified

- Live database schema, constraints, indexes, triggers, RLS policies, and database functions.
- Supabase Auth provider settings, redirect allowlists, email templates, or password policies.
- Supabase Storage bucket existence/policies and actual uploaded files.
- Runtime behavior, deployment environment values, production headers, domain/DNS, email delivery, payments, shipping fulfillment, analytics account configuration, and real checkout completion.
- No test suite or test command is declared in `package.json`; this documentation-only audit did not run the application build or lint.

See [COMPLETE_PROJECT_STRUCTURE.md](./COMPLETE_PROJECT_STRUCTURE.md), [PAGES_AND_FEATURES.md](./PAGES_AND_FEATURES.md), [DATABASE_AND_API.md](./DATABASE_AND_API.md), [ISSUES_AND_IMPROVEMENTS.md](./ISSUES_AND_IMPROVEMENTS.md), and [PROJECT_AUDIT_SUMMARY.md](./PROJECT_AUDIT_SUMMARY.md).
