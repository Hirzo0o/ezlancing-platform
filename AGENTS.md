# Mandatory Ezlancing AI Development Instructions

**Read `AI_RULEBOOK.md` completely before making any code, design, dependency, database, Git or deployment changes.** Also read `README.md`, `docs/BRD.md`, `docs/ARCHITECTURE.md` and `docs/DESIGN_SYSTEM.md`.

- Inspect the real working tree, current branch, active PRs and existing implementation first. Preserve all local and concurrent changes.
- Explain the task, expected behavior, scope, protected behavior, risks, acceptance criteria and tests before editing.
- **Keep the current Ezlancing look and feel unchanged** unless the user specifically requests design work. Treat the supplied `EzLancing.html` as a reference for desired **functionality**, not permission to replace the approved website design.
- Implement in small, independently verified steps. No unrelated refactors, styling changes or speculative fixes.
- Do not add, upgrade, remove or swap packages, services, infrastructure or payment providers without approval.
- Enforce server-side identity, roles, resource ownership, authorization, validation and auditability. A prototype localStorage sign-in is not production authentication.
- Protect projects, proposals, gigs, packages, orders, messages, attachments, reviews, disputes and payment records from unauthorized cross-user access.
- **Never claim funds are escrowed, paid or payable** without an actually integrated, approved provider and compliant legal arrangement. Keep live money movement disabled.
- Keep Arabic RTL / English LTR requirements and the approved logo and tokens. Use **agreement** instead of **contract** in user-facing platform terminology.
- Test the relevant flows and negative paths. Report executed checks truthfully; do not report unrun tests as PASS.
- Work in a feature branch. Never force-push or overwrite user changes. Do not merge into `main` or deploy without explicit approval.
- Before a PR merges, reconcile active branches **twice**, including immediately before merge, with a local-test acceptance gate in between.
- Preserve release history. Use an existing Ezlancing changelog if present; do not copy Jahez-specific paths or release gates into this repository.
- Final report must distinguish files edited, tests run, commit, push, PR, CI, merge and deployment status.

**Rulebook:** `AI_RULEBOOK.md` is authoritative.
