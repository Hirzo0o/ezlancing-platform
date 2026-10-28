# Ezlancing — AI Development Rulebook

**Version:** 1.1  
**Status:** Mandatory repository standard  
**Applies to:** All AI-assisted development, maintenance, debugging, testing, review and delivery in **Ezlancing**.

This is the Ezlancing adaptation of the supplied AI Development Rulebook. It preserves the original process protections while replacing Jahez Pager-specific assumptions with Ezlancing marketplace safeguards. Read it before changing code.

## 1. Non-negotiable principles

1. **Understand before coding.** Restate objective, inspect the implementation, identify risks, acceptance criteria and tests.
2. **Change only what is authorized.** The smallest safe change; no unrelated redesign, refactor or cleanup. The currently approved Ezlancing landing-page look and feel is protected.
3. **One feature at a time.** Implement, verify, review and deliver each independent feature before proceeding.
4. **Ask when consequentially unclear.** Never guess about agreements, payments, legal obligations, identity verification, business rules, security, data ownership or materially different UX.
5. **Lock the stack.** Do not add/change dependencies, runtimes, providers, hosting or infrastructure without explicit approval.
6. **Never fake completion.** Distinguish implemented, tested, committed, pushed, PR-opened, merged, deployed and production-verified.
7. **Maintain an original platform.** Do not copy proprietary source, protected artwork, text or datasets from competing marketplaces.

## 2. Required pre-change workflow

- Read `AGENTS.md`, this rulebook, `README.md`, `docs/BRD.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` and relevant source.
- Inspect Git status, current branch, open PRs, recent commits and concurrent changes; preserve uncommitted work.
- Inspect affected routes, components, API contracts, persistence, auth, validation and tests before touching files.
- Communicate objective, current/expected behavior, smallest proposed change, affected files, protected behavior, risks and verification plan.
- Reproduce defects when practical and identify root causes using evidence.
- Proceed on clear narrow tasks; request approval for consequential ambiguity, destructive operations, material schema changes and dependencies.
- If repository reality differs from assumptions, trust the repository and report discrepancies.

## 3. Scope, UX and localization protections

- Preserve approved layout, spacing, typography, colors, logo, responsive behavior, accessibility, navigation and copy unless specifically requested.
- Preserve existing light/dark themes, if implemented, and their user preference behavior.
- Keep English LTR and Arabic RTL requirements visible in every new feature; do not claim complete localization before it is tested.
- Never confuse the supplied standalone HTML reference/prototype with completed production functionality.
- Keep business concepts consistent: use **agreement** in place of **contract** for platform documents and workflows.
- Do not silently replace the existing Ezlancing design with a different prototype's theme or layout.

## 4. Incremental implementation and debugging

For each feature: (1) write observable acceptance criteria; (2) inspect and reproduce; (3) diagnose root cause; (4) make targeted changes; (5) run relevant checks; (6) verify primary and regression workflows; (7) review full diff; (8) report results and unresolved limitations.

Do not delete, weaken, skip or suppress tests to get green CI. Never hide errors with hardcoding, delays, swallowed exceptions, false success notifications or invented records. If a root cause is uncertain, say so.

## 5. Technology and dependency controls

The repository, not this prose, is the source of truth. At drafting, the feature branch uses Next.js App Router, React, TypeScript, Tailwind CSS, Prisma and PostgreSQL. Confirm the actual `package.json`, Prisma configuration, framework versions and Docker configuration first.

- Use the existing package manager, scripts, conventions and testing framework.
- No dependency/provider version changes without approval; audit findings do not automatically justify `npm audit fix --force`.
- Keep lockfiles reproducible; never commit secrets or downloaded ZIP archives.
- Do not change ports, startup commands, env settings, migrations or deployment configuration without authorization.

## 6. Git, branches and delivery safety

- Inspect working tree before edits and preserve local work, backups and user-provided assets.
- Prefer focused branches and reviewable PRs; do not work on `main` unless explicitly authorized.
- Never force-push, reset shared branches, rewrite history, delete user work or use destructive Git cleanup without approval.
- Review complete diffs for secrets, generated artifacts and unrelated changes.
- Never merge or deploy while required checks fail or before required approval.
- Report branch, commit, push, PR, CI, merge and deployment states independently.

## 7. Testing and truthful reporting

Inspect project scripts to select applicable checks. Typical relevant checks include `npx tsc --noEmit`, `npm run lint`, `npm run build`, Prisma validation, migration tests and scenario tests where available. These are examples, not evidence of execution.

Report **PASS**, **FAIL**, **NOT RUN** or **BLOCKED** for each check, with reason and scope. Verify the actual user workflow, including denied paths, empty states, mobile layout and RTL where relevant.

## 8. Marketplace-specific data and security invariants

- **Identity and roles:** A user may act as client and freelancer, subject to approved permissions. Enforce access server-side; never trust a hidden button or client-held role.
- **Ownership:** Users may see/edit only authorized profiles, projects, proposals, orders, workrooms, messages, files and financial information.
- **Projects and proposals:** Preserve project owner, allowed status transitions, proposal author, bid amount, timestamps and history; prevent duplicate or unauthorized acceptance.
- **Service listings:** Preserve seller ownership, packages, pricing, revisions, publication status and order snapshots after purchase.
- **Orders and deliverables:** Enforce valid lifecycle transitions, revision limits and mutually authorized completion; record auditable changes.
- **Messaging and attachments:** Restrict participants, validate and scan uploads appropriately, use private object storage and prevent cross-conversation data access.
- **Reviews and disputes:** Permit reviews only for eligible completed interactions; preserve moderation audit trails and dispute evidence.
- **Financial integrity:** Use money-safe integer minor units or precise decimal types; idempotency keys, provider signature checks, reconciliation, refunds and ledger immutability.
- **Escrow and payouts:** **No real escrow, custody, guarantees, wallet balance or local payouts** may be claimed or activated until a supported provider arrangement and legal review are complete. Prototype orders are not evidence of paid orders.
- **Privacy and abuse:** Minimize PII, secure sessions, rate limit sensitive operations, manage retention/deletion, redact logs, mitigate spam and impersonation.
- **Localization:** Validate Arabic/English content, RTL/LTR layouts, format of prices and currencies, and region-specific representations.
- **Regional expansion:** Currency presentation and a country selector do not imply provider support, legal market launch or licensing.

These are invariants and acceptance targets, **not claims that each module is already implemented**.

## 9. Unexpected findings

Classify separately: security/data-integrity blocker; blocking prerequisite; non-blocking defect; optional/cosmetic issue. Never silently broaden scope. Preserve existing functionality.

## 10. Mandatory PR workflow — two reconciliations and local acceptance

1. Inspect PR scope, target branch, diffs, dependencies and related open PRs.
2. **First reconciliation:** fetch latest refs, compare current work with active PRs and preserve concurrent changes.
3. Run relevant automated, security and regression checks; report results truthfully.
4. Give exact WSL/local commands to check out, configure, run and test the candidate without overwriting local secrets/data.
5. **Local acceptance gate:** stop before merging to `main`. Obtain explicit approval from the user for the tested candidate. Approval to implement or open a PR is not approval to merge.
6. **Second reconciliation immediately before merging:** fetch newest `main` and other active branches/PRs, preserve concurrent work and rerun affected tests. Never skip.
7. Merge only after local approval, required reviews and passing checks, without bypassing protections.
8. Verify `main` independently after merging and report whether the deployment actually happened.
9. Provide safe local synchronization commands.

If the candidate materially changes after approval, obtain renewed acceptance.

## 11. Release notes and documentation continuity

For every PR changing public UI, behavior, APIs, assets, schema, workflows or dependencies, add a dated, meaningful entry to the repository's **actual** changelog/release-note mechanism **if implemented**. Do not create or assume Jahez Pager's `server/release-notes.json`, Platform/Tenant audience categories or `scripts/check-release-notes.mjs` exist in Ezlancing. If no release-note mechanism exists, record the change and propose one separately; never fabricate history. Preserve existing entries verbatim and do not describe undeployed work as live.

## 12. Required final report

Report: (1) requested outcome; (2) files and changes; (3) checks with PASS/FAIL/NOT RUN/BLOCKED; (4) regression coverage and untested items; (5) branch, commit, push, PR, CI, merge and deploy; (6) blockers and next action.

**Operating principle:** Understand → Plan → Confirm when necessary → Implement narrowly → Test → Review → Deliver with evidence.
