# Ezlancing — Freelance Services & Project Marketplace

**Status:** Early development / Sprint 0 foundation. **Not a production marketplace.**

Ezlancing is an original, planned bilingual (English/Arabic) marketplace connecting clients and freelancers across the Middle East and North Africa, with the potential to serve broader markets. Its product direction brings together **fixed-price freelance services**, **client-posted projects with competitive proposals**, and **freelancer discovery** in one platform. The product must not clone other marketplaces' proprietary code, assets, content or protected interfaces.

> **Do not mistake product requirements, screenshots, or the standalone `EzLancing.html` reference prototype for implemented backend functionality.** A real marketplace requires persistent identity, server-side permissions, payment-provider arrangements, operational controls and tested workflows.

## Business goals and intended users

- **Clients / businesses:** Search services or freelancers, post a project, compare proposals, hire, review milestones and deliverables, and leave eligible reviews.
- **Freelancers:** Set up a profile/portfolio, list fixed-price services and packages, discover projects, submit proposals, manage delivery and receive eligible feedback.
- **Administrators / moderators:** Manage marketplace categories, abuse reports, disputes, trust and safety, verification decisions and operational audit history.
- A user may require both client and freelancer capabilities, subject to an approved access-control design.

## Functional product scope (planned, not yet delivered)

| Area | Intended functionality |
| --- | --- |
| Discovery | Keyword search, categories, region/skill filtering, sorting, service and project details |
| Service marketplace | Freelancer service listings, Basic/Standard/Premium packages, prices, delivery windows, optional add-ons and service orders |
| Project marketplace | Project posting, budget range, skills, description, project discovery, bidding/proposals and client selection |
| Identity and profiles | Secure signup/sign-in, role-aware dashboards, freelancer portfolio, client organization details, verification status |
| Work management | Accepted proposals, agreements, milestones, workrooms, deliverables, revisions and order status |
| Collaboration | Private messaging, attachments, notifications, status history |
| Trust and operations | Reviews, reporting, moderation, dispute workflow, audit trails, fraud/abuse controls |
| Regional foundation | English LTR and Arabic RTL, local currency presentation and region settings where verified |
| Payments — gated | Provider feasibility, sandbox integration, secure settlement and reconciliation; **no live custody/escrow or payouts without legal/provider approval** |

### Reference-prototype behavior to implement in phases

The supplied `EzLancing.html` demonstrates user-facing workflows in a single browser-local HTML application: home and search, gigs with categories and price sorting, project browsing, project posting, a sign-in dialog, a dashboard for orders/bids/projects, gig package selection, and proposal submission. Its `localStorage` state, mock listings, synthetic ratings and simulated orders are **demonstration-only**. Replicate the **business workflows** through the approved Next.js application and secure backend, **without replacing the existing landing page's approved look and feel**. Never use client-local state as authoritative business data.

## Current repository implementation

The `feat/ezlancing-brand-update` branch is the working foundation reviewed for this README. It contains:
- Next.js App Router / React / TypeScript application with an Ezlancing-branded landing-page shell and responsive styles.
- Official logo asset at `public/brand/ezlancing-logo.png` and brand/design documentation.
- PostgreSQL/Prisma schema and local Docker Compose configuration.
- Basic `/api/health` endpoint and a GitHub Actions checks workflow.
- Foundation documents under `docs/`.

**Not yet verified as functioning production capabilities:** secure registration/login, persistent gigs/projects/proposals, payments, escrow, payout services, messaging, full Arabic localization, dispute resolution and admin operations. The repo's `main` may not yet contain the feature branch; check Git before relying on the above.

## Design and brand constraints

The *current approved website appearance remains unchanged* while adding features. Corporate identity materials specify Indigo `#231C53`, Lime `#36E514`/`#4BF31E`, Cyan `#4FE8F4`, Ice `#F0F7FF`, Dark Slate `#0F172A`, Inter for UI and Merriweather for formal documents. See `docs/DESIGN_SYSTEM.md`. Preserve the approved logo, spacing, navigation, accessibility and responsive design. Future functionality must integrate into this design, not the alternative green styling of the HTML functional prototype.

## Technology

Existing feature-branch dependencies (verify installed versions in `package.json`): Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma 7 and PostgreSQL. The architecture is intended to remain a modular monolith until new requirements justify additional infrastructure. Any dependency or infrastructure change requires approval under `AI_RULEBOOK.md`.

## Local development (WSL)

Prerequisites: supported Node.js/npm, Docker Desktop with WSL integration, and your local environment configuration. Never commit `.env` or credentials.

```bash
cd ~/ezlancing-platform
git status --short
docker compose up -d
npm ci
npx prisma migrate deploy
npm run dev
```

Website: http://localhost:3000  
API health: http://localhost:3000/api/health

Use the repository's actual environment template and Prisma configuration when preparing a fresh machine. A sample command is not evidence that the environment has been successfully initialized.

### Validation

```bash
npx prisma validate
npm run lint
npx tsc --noEmit
npm run build
```

Report results as PASS/FAIL/NOT RUN/BLOCKED. Git state, database availability and any browser-extension interference must be reviewed separately rather than mistaken for app correctness.

## Proposed delivery phases

1. **Sprint 0:** Foundation, brand shell, schema, local environment, CI and rules.
2. **Sprint 1:** Secure identity, user roles, client/freelancer profiles.
3. **Sprint 2:** Project posting, discovery, proposals, invitations.
4. **Sprint 3:** Gig catalog, packages, service ordering, buyer and seller dashboards.
5. **Sprint 4:** Agreements, workrooms, messages, deliverables, revisions and reviews.
6. **Sprint 5:** Payment-provider feasibility, sandbox transactions, ledgers, disputes and compliance.
7. **Sprint 6:** Moderation, reporting, security, performance, localization and launch readiness.

Details and open decisions: `docs/BRD.md`, `docs/ARCHITECTURE.md` and `docs/ROADMAP.md`.

## Decisions pending before launch

Launch jurisdiction(s), legal entity and terms; allowed currencies, region coverage and FX display; fees/commissions; age/identity checks; approved marketplace payment and payout partner; treatment of client funds; dispute/refund policy; taxation; privacy and data residency; service-level targets; platform moderation and prohibited-content policies.

## Development governance

**Required reading:** `AGENTS.md` and `AI_RULEBOOK.md`. Protect the existing UI, do one feature at a time, review relevant branches and uncommitted changes, test, provide local acceptance steps, reconcile a second time before any main merge, and never state unverified deployment success.

**GitHub:** https://github.com/Hirzo0o/ezlancing-platform

## Interactive marketplace prototype (`/marketplace`)

The `feat/marketplace-functional-demo-20261028` branch adds a **separate** interactive demo route linked from the current landing page. The existing homepage design, brand colors and layout are retained.

Demo workflows: service catalog filtering/search/sorting; service package details and example order recording; project browsing/filtering/posting; proposal submissions and duplicate-prevention; browser-local name/email demo sign-in; and dashboard summaries of orders, proposals and projects. These features use clearly labeled local browser storage and sample data. **No actual login, backend data persistence, payment, escrow, seller notification or public listing has been implemented.** Opening the demo in a different device or browser will not share records.

Production follow-ups: real session-based auth and roles; Prisma-owned projects/services/proposals/orders; server authorization and validation; multi-user coordination; legal/payment provider due diligence; comprehensive AR/RTL feature coverage; moderation and tests. Any change to the stack or migrations remains approval-gated by `AI_RULEBOOK.md`.
