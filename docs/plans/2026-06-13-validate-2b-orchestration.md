# Validate — Plan 2b: orchestration (skill, references, report, ship handoff)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the validate module's orchestration on top of the 2a foundation: the V0–V4 sprint skill + command, the GTM/conversion/honesty references, the report template, the studio writeback, and the `ship-feature` delivery-commitment intake — encoding that **the kit briefs the page and the human builds it** (no auto-page).

**Architecture:** Markdown skill/command/reference/template authoring (lint-verified) plus one repositioning of the 2a page artifact. The only executable logic (the Gate V evaluator) already shipped in 2a and is unchanged; the validate skill *calls* `gate-eval.mjs` rather than re-judging (C6). Work continues on `feat/validate`; one PR for the whole validate module (2a + 2b) at the end.

**Tech Stack:** Markdown, YAML, Bash (`scripts/lint.sh`, `scripts/test.sh`), `node` (2a tests must stay green). Built-in primitives only (C1).

**Specs:** `docs/specs/2026-06-13-discover-validate-design.md` §4 (validate phases, §4.3 human-built page, §4.6 Gate V, §4.7 report, §4.8 ship contract, §5 studio) + `docs/specs/2026-06-13-frontend-reconciliation-design.md` §6–§7 (audit feeds validate). Config keys exist under `validate:`.

**Branch precondition:** on `feat/validate` with 2a committed. Confirm `git rev-parse --abbrev-ref HEAD` is `feat/validate` and `node --test templates/landing/*.test.mjs` prints `# pass 12`.

**Conventions for every task:**
- After each change: `scripts/lint.sh` (or `--complete`) → `lint OK`; `node --test templates/landing/*.test.mjs` stays green.
- No `{{` under `skills/` or `commands/` (use `<angle>` placeholders); `{{TOKENS}}` allowed under `templates/`.
- Commit per Conventional Commits; every message ends with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

---

## File structure

- `templates/landing/wiring-reference.html` — the 2a page artifact, **repositioned** from "the landing page" to a labeled wiring reference (the human builds the real page).
- `skills/validate/references/landing-conversion.md` — the conversion brief method + wireframe spec + the conversion rubric + human-build + wiring (the heart of the human-built-page posture).
- `skills/validate/references/honesty-floor.md` — shared 5-hard-stop honesty floor (validate + referenced by discover D2).
- `skills/validate/references/guerrilla-playbook.md` — channel standing, named-prospect list, DM-first scripts, anti-burn.
- `templates/validate/validation-report.md` — the V4 report template (funnel, gate-eval verdict + raw rows, delivery commitment).
- `skills/validate/SKILL.md` — V0–V4 orchestration; calls `gate-eval.mjs`; pre-launch gate; studio writeback.
- `commands/validate.md` — the command.
- `skills/ship-feature/SKILL.md` — **edited**: delivery-commitment intake (spec §4.8).
- `README.md`, `.claude-plugin/{plugin,marketplace}.json`, `scripts/lint.sh` — add `/builderkit:validate`; present the now-complete chain.

---

## Task 1: Reposition the 2a page artifact (no auto-page)

**Files:**
- Rename: `templates/landing/index.html` → `templates/landing/wiring-reference.html`
- Modify: `templates/landing/README.md`, `scripts/lint.sh`

- [ ] **Step 1: Rename the file**

```bash
git mv templates/landing/index.html templates/landing/wiring-reference.html
```

- [ ] **Step 2: Add a banner at the very top of `wiring-reference.html`**

Insert these two lines immediately after the `<!doctype html>` line:
```html
<!-- WIRING REFERENCE ONLY — NOT a launch-ready page. BuilderKit ships no auto-page.
     Build & design your real page in your own tool; reuse the capture/preauth wiring below. -->
```

- [ ] **Step 3: Update `templates/landing/README.md`**

In the "## Pieces" list, replace the `index.html` bullet with:
```markdown
- `wiring-reference.html` — a WIRING REFERENCE (not a launch page): shows how a page
  calls `capture()` / `recordLand()` / `startPreauth()`. You build and design the real
  page in your own tool (see `skills/validate/references/landing-conversion.md`) and
  reuse this wiring. The kit ships no auto-page.
```

- [ ] **Step 4: Update the lint manifest**

In `scripts/lint.sh`, in the `--complete` list, change:
```
    templates/landing/index.html templates/landing/payment-intent.mjs \
```
to:
```
    templates/landing/wiring-reference.html templates/landing/payment-intent.mjs \
```

- [ ] **Step 5: Verify + commit**

```bash
test -f templates/landing/wiring-reference.html && test ! -f templates/landing/index.html && echo "renamed OK"
node --test templates/landing/*.test.mjs 2>&1 | grep -E '# (pass|fail)'
scripts/lint.sh --complete
git add -A
git commit -m "refactor(validate): reposition landing page as wiring-reference (no auto-page)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: `renamed OK`; `# pass 12`/`# fail 0`; `lint OK`.

---

## Task 2: Conversion, honesty, and GTM references

**Files:**
- Create: `skills/validate/references/landing-conversion.md`
- Create: `skills/validate/references/honesty-floor.md`
- Create: `skills/validate/references/guerrilla-playbook.md`

- [ ] **Step 1: Write `skills/validate/references/landing-conversion.md`**

```markdown
# Landing conversion — the kit briefs, the human builds

The kit does NOT generate a launch-ready page. Conversion is human-owned craft, and an
auto-page would under-convert and **confound Gate V** (a FAIL becomes ambiguous between
"no demand" and "bad page"). The kit produces a conversion BRIEF; the human builds and
designs the page in their own tool and wires it to the kit's capture + WTP probe.

## What the kit produces (the brief)
1. **Strategy** — the single outcome the page promises; the sharp ICP; the one primary
   CTA; the one objection that most blocks it.
2. **Copy** — 3 headline options (a SPECIFIC outcome, not clever wordplay); a
   problem-agitate-solve block in the ICP's own words; the value prop; the CTA label
   (an outcome, never "Submit"); 2-3 objection answers. Sourced from the discover
   brief's wedge + intensity evidence.
3. **Wireframe** — the layout/order below.
4. **Rubric** — the checklist the human's page must clear before launch.
5. **Wiring** — how to call `capture()` / `recordLand()` / `startPreauth()` (see
   `${CLAUDE_PLUGIN_ROOT}/templates/landing/`).

## Wireframe (mobile-first order)
Above the fold: specific-outcome headline -> one-line subhead -> single primary CTA.
Then: problem agitate (their words) -> how it works (<= 3 steps) -> proof/credibility
-> objection answers -> CTA again -> the two-signal WTP probe -> honesty/early-access line.

## Conversion rubric (the human's page must clear ALL before launch)
- [ ] Headline names a SPECIFIC outcome for the ICP (a stranger gets it in ~5 seconds).
- [ ] ONE primary CTA, repeated; no competing asks.
- [ ] The problem is stated in the ICP's own words (from the discover brief), above the fold.
- [ ] Credibility is present and REAL (who is behind it, a concrete demo/screenshot, or a
      specific mechanism) — never fabricated.
- [ ] Mobile-first; loads fast (~2s); no layout shift.
- [ ] The two-signal WTP probe is wired (hard preauth + soft intent-click).
- [ ] Honesty line states the real stage ("early access — not built yet").
- [ ] Capture fires: a test land + signup + probe each record an event.

## Honesty floor
Load `${CLAUDE_PLUGIN_ROOT}/skills/validate/references/honesty-floor.md`; the page must
clear its five HARD STOPS before launch.

## Disclosure posture (anti-leak)
Reveal the problem + WTP framing; keep any genuinely novel mechanism vague. Easily-cloned
concepts bias toward 1:1/DM validation over a fully public page.

## Pre-launch gate
The sprint does not count until a human reviews/edits the page against this rubric, signs
off, and a test event confirms capture fires. The kit never auto-launches a page.
```

- [ ] **Step 2: Write `skills/validate/references/honesty-floor.md`**

```markdown
# Honesty floor (loaded by validate; referenced by discover D2)

Aggressive validation stays honest. Five HARD STOPS — a page, probe, or DM must clear
all of them before it goes live or any payment/PII is captured:

1. No fabricated social proof, metrics, press, logos, or user counts.
2. No claiming a non-existent product is live — state the real stage ("early access —
   not built yet").
3. No taking real money without a disclosed refund/cancellation path (the default
   pay-proof is a refundable pre-auth hold, not a charge).
4. No collecting PII without a visible notice (ship the privacy stub).
5. No raw PII in `studio/` — aggregate patterns only; PII stays in `validate.data.*`.

Truthful-stage offers, real deadlines only (no fake scarcity), no dark patterns the
wedge rejects. Skipping a manipulative tactic is a deliverable — write down why.
```

- [ ] **Step 3: Write `skills/validate/references/guerrilla-playbook.md`**

```markdown
# Guerrilla GTM playbook (<= $50, founder-run)

Only job: the fastest, cheapest path to real signups from people who don't know you.

## Channel standing (V1, before the clock)
Score each candidate channel on standing from public signals (account age, history,
karma, whether it auto-removes link-first/low-karma posts, mod-DM required). Label WARM
(can post credibly now) vs NOT-WARM. Only WARM channels feed the 48h clock. Zero WARM ->
default to 1:1 direct outreach.

## Named-prospect list (required-to-attempt)
Build a list of specific, individually-reachable ICP members from the discover dossier
(complainers, competitor reviewers, question-askers, workaround-buyers). Target
`validate.gtm.named_list_target` (default 30). Unreachable -> write WHY and proceed (a
distribution-realist signal, not a stall).

## Default channel order (cold-start prior; overridable, log the rationale)
1. **1:1 direct outreach** to the named list (highest yield, ToS-safe).
2. **Intent-concentrated venues** ("is there a tool for X" threads, competitor churn).
3. **Borrowed distribution** — one value-first ask to an audience-holder.
4. **Broadcast posting** only where the founder has standing.

## Scripts
- **1:1 cold DM/email:** open with their words (from the dossier) -> one specific
  question about the problem -> offer early access / a pre-sell. No pitch wall.
- **Borrow-distribution ask:** lead with value to the audience-holder; make it easy to
  say yes; two-sided benefit.

## Anti-burn (protect the founder's standing across products)
Stagger identical links; lead with value and put the link in a comment/DM follow-up;
never repost the same pitch to a venue twice; a relaunch must change venue OR angle.
Read/write the standing ledger so product #2 doesn't re-burn product #1's wells.
```

- [ ] **Step 4: Verify + commit**

```bash
grep -rn '{{' skills/validate/ || echo "no-braces"
scripts/lint.sh
git add skills/validate/references/
git commit -m "feat(validate): conversion brief, honesty floor, guerrilla playbook references

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: `no-braces`; `lint OK`.

---

## Task 3: Validation report template

**Files:**
- Create: `templates/validate/validation-report.md`

- [ ] **Step 1: Write `templates/validate/validation-report.md`** (braces allowed — `templates/`)

```markdown
# Validation Report — {{SLUG}}

> Written by /builderkit:validate (V4). The verdict is recomputed by gate-eval.mjs from
> the raw rows; a verdict without its counted rows is a defect (spec C6).

## Sprint
- Window: {{WINDOW_START}} -> {{WINDOW_END}} (clock from first qualified impression)
- WARM channels: {{CHANNELS}} · budget spent: {{SPEND}} / {{BUDGET_CAP}}
- Frozen-predicates hash: {{PREDICATES_HASH}}

## Funnel (per tier x cohort)
| tier | cold_public | warm_dm | friend | unverifiable |
|------|-------------|---------|--------|--------------|
| lands | | | | |
| signups | | | | |
| activations | | | | |
| pay-proof | | | | |

## Gate V verdict (from gate-eval.mjs)
- Verdict: {{PASS | FAIL | INCONCLUSIVE | NOT-MEASURABLE}}
- Reason: {{REASON}}
- Counted users: {{N}} · weighted: {{W}} · cold-weight fraction: {{CWF}} · friend share: {{FS}}
- Cold hard pay-proof: {{YES | NO}}
- Raw counted rows (ts · tier · cohort · predicate satisfied · exclusions applied):
  {{ROWS}}

## Captured cold-user list (the waitlist — GOLD; PII lives in validate.data.*, never studio/)
{{...}}

## Delivery commitment (binding Phase-0 input for /builderkit:ship)
- The promise the winning page made (feature, price, delivery window stated to payers): {{...}}
- Paid cohort: {{...}}
- First-access deadline ({{MAX_DAYS}} days, from validate.delivery.max_days_to_first_access): {{...}}

## Recommendation
{{proceed to /builderkit:ship | iterate-GTM (variant before kill) | back to /builderkit:discover | kill}}
```

- [ ] **Step 2: Verify + commit**

```bash
scripts/lint.sh
git add templates/validate/validation-report.md
git commit -m "feat(validate): validation-report template (verdict + raw rows + delivery commitment)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: `lint OK`.

---

## Task 4: The validate skill + command

Depends on Tasks 1–3 (it cross-references the references, the report template, and `templates/landing/`).

**Files:**
- Create: `skills/validate/SKILL.md`
- Create: `commands/validate.md`

- [ ] **Step 1: Write `skills/validate/SKILL.md`**

````markdown
---
name: validate
description: >
  BuilderKit's 48-hour live validation sprint: prove real cold-stranger demand before
  building. V0 freeze the Gate V predicates + sprint state -> V1 guerrilla GTM (channel
  standing, named-prospect list, DM-first) -> V2 conversion brief (the kit BRIEFS; the
  HUMAN builds the page) + measurement plumbing -> V3 launch (human posts; cold-tagged
  ingestion; pull-based polling) -> V4 report with the gate-eval verdict + delivery
  commitment. Gate V: >=10 cold-weighted users + >=1 cold hard pay-proof, recomputed
  from raw rows by gate-eval.mjs (the builder is not the scorer, C6). Self-contained;
  reads .builderkit/config.yaml; input = the discover/audit handoff.
---

# /validate — 48h live validation sprint

Prove real cold demand before building. Consumes a discover Hardened Hypothesis Brief
that cleared Gate D and was planned by /builderkit:audit (the audit supplies the
conversion brief's growth/landing plays + the build list). Five phases; the gate is
un-gameable by construction.

**Config first.** Read .builderkit/config.yaml (`validate.*`, `product:`). Missing ->
point the user at /builderkit:setup. The project's CLAUDE.md overrides this skill.

## Operating rules
- **Self-contained (C1).** Built-ins + the project's declared connectors only.
- **Builder is not the scorer (C6).** The verdict is recomputed by
  `${CLAUDE_PLUGIN_ROOT}/templates/landing/gate-eval.mjs` over the raw rows,
  reproducibly. Never declare PASS from memory.
- **The kit ships no auto-page.** The human builds it (V2); the kit briefs + verifies.
- **Serial by default** (`validate.max_concurrent_sprints`): refuse a 2nd open sprint.
- **Report honestly.** If a gate could not run (no connector, no traffic), say so in the
  report — never imply a check happened when it didn't.

## V0 — Instrument + freeze the gate
Classify archetype -> set the window (`validate.window_hours`; marketplace/considered
purchases may extend to `max_window_hours`). Build the frozen predicates from
`validate.gate` (compute `pay_proof.min_amount = min_pct_of_price x the D2 price`) and
HASH them into the brief BEFORE anything is built. Create the durable sprint-state file
at `<validate.sprints_dir>/<slug>.yaml` (window bounds, deploy/data/payments resource
ids, channels_posted, last_event_cursor, tier_counts, gate_status). On re-invocation,
**load-and-branch**: open -> resume from the cursor; past window -> evaluate; passed/
failed -> report the prior verdict. Never re-create infra mid-sprint.

## V1 — Guerrilla GTM (DM-first)
Run `${CLAUDE_PLUGIN_ROOT}/skills/validate/references/guerrilla-playbook.md`: channel
standing, the named-prospect list, per-channel tracked links (the `?src=` tag classifies
the cohort). Default channel order leads with 1:1 outreach. The cheap pulse already came
from discover D2's DMs; V1 scales it through WARM channels. Draft every post/DM. Stay
<= `validate.budget_cap_usd`.

## V2 — Conversion brief (kit) -> the human builds the page
Produce the conversion brief with
`${CLAUDE_PLUGIN_ROOT}/skills/validate/references/landing-conversion.md`: strategy +
copy + wireframe + the rubric, using audit's growth/landing plays + the discover wedge.
Ship the measurement plumbing from `${CLAUDE_PLUGIN_ROOT}/templates/landing/`
(`capture.js`, `schema.sql`, `payment-intent.mjs` preauth, `privacy.md`, `gate-eval.mjs`)
wired to `validate.deploy` / `validate.data` / `validate.payments` (a blank connector ->
planner-mode for that step, per C2). **The human builds and designs the page** and wires
it to the plumbing.

**Pre-launch gate (the sprint does not count until this passes):** verify the
human-built page (a) clears the conversion rubric with explicit human sign-off, (b)
clears the honesty floor
(`${CLAUDE_PLUGIN_ROOT}/skills/validate/references/honesty-floor.md`), and (c) actually
fires the capture events (a test land/signup/probe is recorded). A verify-fail sends the
page back for edits — no new loop. The kit never auto-launches a page.

## V3 — Launch (human posts; cold-tagged ingestion)
The founder posts from their own accounts (`auto_post: false`). The clock starts at the
first qualified impression. Ingest events tagged by source cohort; tag-and-drop founder
/ known-contact / agent rows at ingestion (`gate.founder_identifiers`, `exclude_self`) so
contamination can never trip the gate. Monitoring is **pull-based** — the founder
re-runs /validate to poll; each poll advances the cursor idempotently. An optional GitHub
Actions cron can poll hands-off, but is never required.

## Gate V — recomputed, three-way + not-measurable
Export the raw rows + the qualified-lands count and call `evaluateGate({rows, lands,
measurable}, predicates)` from `gate-eval.mjs` against the frozen predicates (its logic
is unit-tested via `node --test`; the skill just calls it and reports its result + the
raw counted rows). Outcomes:
- **PASS** — exposure met, cold-weighted floor met, >=1 cold hard pay-proof -> hand
  audit's build list to /builderkit:ship.
- **INCONCLUSIVE** — lands below the exposure floor -> extend once / re-channel; NEVER
  kick back to discover on thin traffic.
- **FAIL** — lands met but no pay-proof or land-and-bounce -> **variant-before-kill**:
  run `validate.gate.message_variants_before_kickback` copy/offer variants + one free
  cross-channel re-test first; only a same-strength page failing across variants routes
  back to /builderkit:discover. Bound by `validate.max_rounds` + the global
  `studio.max_concept_cycles`.
- **NOT-MEASURABLE** — analytics never fired / payments stuck in sandbox -> fix
  instrumentation (bounded by `validate.gate.max_repair_attempts`); on exhaustion,
  degrade to a human-judged manual count from the raw evidence.

## V4 — Validation Report + delivery commitment
Write `<docs.specs_dir>/YYYY-MM-DD-<slug>-validation.md` from
`${CLAUDE_PLUGIN_ROOT}/templates/validate/validation-report.md`: the funnel per
tier x cohort, the gate-eval verdict WITH its raw counted rows, the captured cold-user
list (PII in `validate.data.*`, never `studio/`), and the **delivery-commitment block**
(the promise the page made, the paid cohort, the first-access deadline) that
/builderkit:ship reads as binding Phase-0 input.

## Studio loop
Read `.builderkit/studio/playbook.md` as priors (advisory; never gate). Write one
`.builderkit/studio/validation-log.md` row, tagged (icp_type, archetype, primary_channel,
channel_standing, cold land->pay rate, founder_hours, outcome) — record FAILs too.
Promote a tactic to `supported` only after it converts across >= `studio.promote_after_k`
runs AND >= 2 distinct ICPs. Log a panel-vs-outcome entry when the market confirms or
refutes a discover red-team call. No PII in `studio/`.

## Multi-agent quick reference
| Work | Agent | Parallel? |
|---|---|---|
| V1 community / standing research | `Explore` (read-only) | Yes |
| Conversion-brief copy drafts | `general-purpose` | optional |
| V0 freeze, gate-eval call, pre-launch gate, V4 report | orchestrator | Never delegated |
````

- [ ] **Step 2: Write `commands/validate.md`**

```markdown
---
description: Run the BuilderKit 48h validation sprint — prove real cold demand before building
argument-hint: [hypothesis-brief-path | poll | report]
---
Invoke the builderkit `validate` skill for: $ARGUMENTS. Read .builderkit/config.yaml
first. Input is the /builderkit:discover Hardened Hypothesis Brief (post-Gate-D, planned
by /builderkit:audit). The kit briefs the conversion page + ships the measurement
plumbing; the HUMAN builds and designs the page. Gate V is recomputed by gate-eval.mjs
from the raw rows (the builder is not the scorer). "poll" advances the sprint cursor;
"report" writes the V4 validation report. On PASS, audit's build list feeds
/builderkit:ship.
```

- [ ] **Step 3: Verify frontmatter, no braces, cross-references resolve, lint**

```bash
head -c 3 skills/validate/SKILL.md; echo
head -c 3 commands/validate.md; echo
grep -rn '{{' skills/validate/ commands/validate.md || echo "no-braces"
for f in skills/validate/references/landing-conversion.md skills/validate/references/honesty-floor.md skills/validate/references/guerrilla-playbook.md templates/landing/gate-eval.mjs templates/validate/validation-report.md; do [ -f "$f" ] && echo "OK $f" || echo "MISSING $f"; done
scripts/lint.sh
```
Expected: `---` twice; `no-braces`; five `OK` lines; `lint OK`.

- [ ] **Step 4: Commit**

```bash
git add skills/validate/SKILL.md commands/validate.md
git commit -m "feat(validate): the V0-V4 sprint skill + command (calls gate-eval, human builds page)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: ship-feature delivery-commitment intake

**Files:**
- Modify: `skills/ship-feature/SKILL.md`

- [ ] **Step 1: Insert a validation-handoff subsection into Phase 0**

In `skills/ship-feature/SKILL.md`, find the end of the `## Phase 0 — Intake` section
(immediately before `### Phase 0.5 — Prioritize`). Insert this subsection right before
`### Phase 0.5`:

```markdown
### Phase 0 — Validation handoff (when a Validation Report exists)

If a `/builderkit:validate` Validation Report with a **delivery-commitment block** is
present for this work, it is **binding Phase-0 input**:

- The FIRST shippable slice must satisfy the promise the validated page made (feature,
  price, the delivery window stated to payers) before any roadmap expansion — the build
  is scoped by what was *sold*, not re-discovered.
- Carry the **refund-runbook obligation**: if the committed first-access deadline
  (`validate.delivery.max_days_to_first_access`) cannot be met, emit the payer list + a
  refund runbook as a release-blocking owed step (never auto-move money).
```

- [ ] **Step 2: Verify + commit**

```bash
grep -n 'Validation handoff' skills/ship-feature/SKILL.md
grep -rn '{{' skills/ship-feature/SKILL.md || echo "no-braces"
scripts/lint.sh
git add skills/ship-feature/SKILL.md
git commit -m "feat(ship-feature): accept validate delivery-commitment as binding Phase-0 input

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: the heading line prints; `no-braces`; `lint OK`.

---

## Task 6: Docs + manifests — validate is live

**Files:**
- Modify: `README.md`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `scripts/lint.sh`

- [ ] **Step 1: README — add the validate command row**

In the Commands table, insert after the `/builderkit:audit` row:
```markdown
| `/builderkit:validate [brief\|poll\|report]` | 48h validation sprint: freeze Gate V → guerrilla GTM → conversion brief (you build the page) → launch → recompute the verdict from raw rows. Gate V = ≥10 cold users + ≥1 cold pay-proof. |
```

- [ ] **Step 2: README — note the human-built page in the pipeline section**

In the `## The pipeline (discover → audit → validate → ship → loop)` section, replace the
`- **validate** ...` bullet with:
```markdown
- **validate** (`/builderkit:validate`) — a 48-hour guerrilla sprint that gates on real
  cold-stranger willingness to pay. The kit briefs the conversion page + ships the
  measurement plumbing and the deterministic Gate V evaluator; **you build and design the
  actual page** (conversion is human-owned craft). The verdict is recomputed from the raw
  rows, so the builder is never the sole scorer.
```

- [ ] **Step 3: plugin.json + marketplace.json**

These descriptions already name validate (set during the reconciliation). Confirm they
still read correctly and leave them unchanged unless they omit validate. (No edit needed
if `git grep -l validate .claude-plugin/` lists both files.)

- [ ] **Step 4: lint manifest — add the validate files**

In `scripts/lint.sh`, in the `--complete` list, add these lines right before the
`templates/maestro/boot.yaml ...` line:
```
    commands/validate.md skills/validate/SKILL.md \
    skills/validate/references/landing-conversion.md skills/validate/references/honesty-floor.md skills/validate/references/guerrilla-playbook.md \
    templates/validate/validation-report.md \
```

- [ ] **Step 5: Verify**

```bash
git grep -l validate .claude-plugin/ && echo "manifests name validate"
python3 -m json.tool .claude-plugin/plugin.json >/dev/null && python3 -m json.tool .claude-plugin/marketplace.json >/dev/null && echo "json ok"
grep -rn '{{' skills/ commands/ || echo "no-braces"
node --test templates/landing/*.test.mjs 2>&1 | grep -E '# (pass|fail)'
scripts/lint.sh --complete
```
Expected: both manifests listed; `json ok`; `no-braces`; `# pass 12`/`# fail 0`; `lint OK`.

- [ ] **Step 6: Commit**

```bash
git add README.md scripts/lint.sh .claude-plugin/plugin.json .claude-plugin/marketplace.json
git commit -m "docs: validate is live — command row, pipeline note, lint manifest

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Final verification & PR

- [ ] **Step 1: Full gates**

```bash
scripts/test.sh                         # node --test: # pass 12 # fail 0
scripts/lint.sh --complete              # lint OK
grep -rn '{{' skills/ commands/ || echo "no-braces"
grep -rinE 'bartek|marzec|@bartek|product design playbook' skills/ commands/ templates/ README.md .claude-plugin/ || echo "ip-clean"
```
Expected: tests pass; `lint OK`; `no-braces`; `ip-clean`.

- [ ] **Step 2: Cross-references resolve**

```bash
for f in $(grep -ohE '(skills/validate/references/[a-z-]+\.md|templates/landing/[a-z.-]+\.mjs|templates/validate/[a-z-]+\.md)' skills/validate/SKILL.md commands/validate.md | sort -u); do [ -f "$f" ] && echo "OK $f" || echo "MISSING $f"; done
```
Expected: every line `OK`.

- [ ] **Step 3: Push and open ONE PR for the whole validate module (2a + 2b)**

```bash
git push -u origin feat/validate
gh pr create --base main --head feat/validate --title "feat: validate module (48h sprint + tested Gate V evaluator)" --body "<see body below>"
```
PR body: summarize 2a (the tested Gate V evaluator + landing plumbing) + 2b (the V0–V4
sprint skill, GTM/conversion/honesty references, report template, ship handoff), the
human-built-page posture, and the C6 measurement-integrity design. Note that `feat/validate`
is stacked on `feat/product-strategy` (PR #2) — set the base to `main` only after PR #2
merges, else target the PR at `feat/product-strategy` and re-target to `main` after #2
lands. End the body with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

- [ ] **Step 4: Dry-read pass**

Open `skills/validate/SKILL.md` and `skills/validate/references/landing-conversion.md`
with fresh eyes. Confirm: V2 clearly states the kit briefs and the HUMAN builds the page;
the pre-launch gate (rubric + sign-off + capture-fires) is present; Gate V is recomputed
by `gate-eval.mjs` (not re-judged); the report carries raw rows; the ship handoff is
binding. Fix any drift, re-run `scripts/lint.sh --complete` + `scripts/test.sh`, amend.

---

## Out of scope (already done or deferred)

- The Gate V evaluator + landing plumbing — Plan 2a (done).
- Medium-tier discover/validate review findings — spec `2026-06-13-discover-validate-design.md` §10.
- An optional GitHub Actions cron for hands-off polling — documented as optional; not scaffolded here.
