---
name: linear
description: >
  BuilderKit Linear integration. Part A — reusable mechanics: per-item ticket
  conventions, native attachment upload, status transitions, completion
  comments, MCP-fallback rules (used by the ship-feature historian). Part B —
  Lifecycle: run a single Linear issue end-to-end via /builderkit:linear-issue
  (read → implement → verify → deploy → close with proof). Reads team/url from
  .builderkit/config.yaml.
---

# /linear — Linear integration (mechanics + single-issue lifecycle)

Two parts. **Part A** is the canonical home of the reusable Linear mechanics
(ticket model, access/fallback, status discipline, evidence attachment,
completion comments) — the ship-feature historian points here, so they live in
exactly one place. **Part B** is the single-issue lifecycle driven by
`/builderkit:linear-issue <id>`, which takes one ticket from read to a
proof-carrying close.

**Config first.** Read `.builderkit/config.yaml` before touching Linear. The
team key is `linear.team`; the board URL is `linear.url`. Missing config → stop
and point the user at `/builderkit:setup`. The project's `CLAUDE.md` overrides
both this skill and the config where they conflict.

---

## Part A — Reusable Linear mechanics

These conventions apply to every Linear ticket BuilderKit creates — whether the
ship-feature historian is journaling a pipeline run or Part B below is driving a
single issue. Follow all six.

### A1. Ticketing model

- **One ticket per fix/feature** — never one ticket per pipeline run. Each unit
  of work is individually trackable, and future agents read the tickets as
  context.
- **Multi-item waves get a parent issue.** Per-item issues link to it as
  sub-issues or with a "part of" relation; the parent carries the rollup.
- **Out-of-scope discoveries become their OWN linked backlog issues** — never
  silently dropped. Link them to the issue (or wave) where they surfaced.
- **Priority field maps from the prioritization score**: top score or a
  blocking/data-loss bug → **Urgent** or **High**; middle of the pack →
  **Medium**; fill-ins → **Low**. A user-stated order overrides the computed
  one (note the override on the ticket).
- Team key = `linear.team`, board = `linear.url`, both from config.

### A2. Access + fallback

- Use the **Linear MCP tools** when available. Fall back to the **Linear
  GraphQL API with a personal API key** when the MCP isn't connected.
- **If neither is reachable, surface it to the user IMMEDIATELY in the first
  reply** — the OAuth link to connect the MCP, or the fact that the API key is
  missing. Never defer this to a final summary; a user who learns at the end
  that nothing was journaled can't fix it in time.
- **Work proceeds regardless.** The spec doc stays the source of truth, and
  every ticket is backfilled the moment access exists — in the same session
  when possible.

### A3. Status discipline

- **Fetch status IDs live** with `list_issue_statuses` — capture the IDs for
  **In Progress**, **In Review**, and **Done** (or their team equivalents)
  upfront; statuses vary per team and must not be hardcoded.
- **In Progress** when the build starts. **In Review** on push / PR open.
- **Only the user's merge/ship moves a ticket to Done — never close it
  yourself.** (Part B's lifecycle mode is the single exception: it closes a
  ticket after a verified deploy and, when a PR was opened, a merged PR — see
  Part B step 6.)

### A4. Evidence attachment (mandatory)

- **Every completed ticket carries an attached screenshot proving the
  implemented behavior.** Not optional, not "when available."
- Prefer the driver's **named evidence artifact** for the item's flow
  (`<R-id>-<step>.png` — deterministic, regenerated every run). Else a
  device/browser capture of the after-state.
- **Attach natively**, do not just link a file path:
  `prepare_attachment_upload` → PUT the file to the returned URL →
  `create_attachment_from_upload`.
- For **non-visual changes** (API-only, types), the screenshot shows the
  user-observable consequence — the surface that no longer misbehaves; there is
  almost always one. If recon truly can't name a surface, **say so explicitly
  on the ticket and attach the test output instead.**
- **A ticket without attached evidence is not done journaling.**

### A5. Completion comments

Markdown, posted via the MCP `save_comment` (or a GraphQL comment on fallback).
Include:

- **What changed** — the why, not just the what.
- **Verification evidence verbatim** — typecheck output, unit-suite counts, e2e
  results. Paste the real output, don't paraphrase.
- **Divergences** from the literal request, and why.
- **Owed gates flagged loudly** — anything that couldn't run in this
  environment, named explicitly.
- **Commit SHA(s) + PR link + fix version** (the release version if the project
  tracks one, else the branch/PR).

### A6. As context

Before starting new work on a surface, **search Linear for prior issues
touching it** (`list_issues` filtered by the surface / labels) and feed the
relevant ones to recon — they often carry the root cause, prior divergences, or
the design reference.

---

## Part B — Lifecycle (`/builderkit:linear-issue <id>`)

Run one Linear issue end-to-end: read → implement → verify → deploy → close
with proof. Six steps. **Do not stop after implementation, and do not ask the
user to verify** — complete all six autonomously. Every step follows the Part A
mechanics above (status IDs from A3, evidence from A4, comment format from A5).

If no ID is provided, ask the user which issue to work on. Accepts a bare ID
(`COR-42`) or a full Linear URL.

### B1. Read

- `list_issue_statuses` — **capture the In Progress / In Review / Done IDs**
  (A3); you need them in B2 and B6.
- `get_issue` — title, description, priority, linked relations.
- `list_comments` — read the **full thread**: acceptance criteria, design
  notes, prior context.
- **Map scope to the repo's apps/packages** from `config` (stack, workdir) and
  the repo layout. Before touching a surface, search Linear for prior issues on
  it (A6).

### B2. Implement

- **Mark In Progress BEFORE writing code** (`save_issue` with the In Progress
  ID).
- Branch-or-direct per the repo's convention. **Prefer a feature branch + PR
  when CI exists** (so the suite runs); push direct to the default branch only
  when that's the repo's documented flow for the change class.
- If the issue's design/request can't be implemented as described (missing schema, missing token), implement the closest correct version and document the divergence in the completion comment — never silently ship something different.

### B3. Verify

- Run the BuilderKit e2e-testing gate for the project's driver:
  `${CLAUDE_PLUGIN_ROOT}/skills/e2e-testing/SKILL.md` (which dispatches to
  `drivers/<testing.driver>.md`). **The project `CLAUDE.md`'s verification
  rules override** this skill where they overlap.
- **No commit until green.** A failed check loops back to B2 — never commit
  blind.
- **Capture evidence per A4** as you verify — the named flow artifact or an
  after-state capture — for the close in B6.
- Console warnings count: a new runtime warning/error introduced by the change (browser console, RN red-box, server log) is a verification failure — fix before commit.

### B4. Deploy & monitor

Do **only what the stack implies**, never guessing at infrastructure:

- **Auto-deploy-on-push stacks** (e.g. Vercel): poll deployment status until
  **READY** (not BUILDING/QUEUED) and capture the **build-log link** as proof.
  On `ERROR`: read the logs, fix, re-push — see error handling.
- **DB migrations**: apply per the repo's convention (CLI push, or the
  project's migration MCP) only when migration files changed.
- **Stack-conditional, `stack: expo` ONLY:** **NEVER auto-run `eas build` or
  `eas submit`.** The mobile binary ships on the user's explicit instruction —
  note in the completion comment that the build/submit is awaiting it. (Push
  code and stop for the mobile target.)

### B5. Verify platforms

**Smoke each affected deploy target** and capture proof:

- HTTP **200** plus expected content (a `curl` of a health/root route, or the
  expected `<title>`/marker).
- Capture the proof (status code + a screenshot or response snippet) for the
  close.

### B6. Close with proof

- Post a **completion comment per A5** — what changed, verification evidence
  verbatim, divergences, owed gates, commit SHA + PR link + fix version — with
  **evidence attached per A4**.
- **If a PR was opened**: transition to **Done only after `mergedAt` is
  non-null** (`gh pr view <n> --json mergedAt`). Else mark **Done after
  platform verification** (B5) passes.

### Error handling

- **Verification fails (B3):** fix and re-verify; never commit blind. If the
  test harness itself can't start, fix that first.
- **Deploy fails (B4):** read the logs, fix the code, **re-push before
  closing** — do not close on a failed build.
- **Smoke returns non-200 (B5):** investigate before closing (often a
  misconfigured env var or an unapplied migration).
- **Can't apply a migration:** note it **explicitly with the migration file
  path** and flag it for manual application; still close if every other target
  is verified and the migration is low-risk DDL.
- **MCP write fails:** fall back to a comment carrying the full update (A5), so
  the thread still documents what was done.

---

## Usage

```
/builderkit:linear-issue <issue-id-or-url>
```

Examples: `/builderkit:linear-issue COR-42`,
`/builderkit:linear-issue https://linear.app/<org>/issue/COR-42`.
