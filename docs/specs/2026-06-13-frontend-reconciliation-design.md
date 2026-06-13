# BuilderKit — front-end reconciliation (discover ⊃ evaluate; audit retargeted)

Date: 2026-06-13
Status: approved design, pre-implementation
Author: malikriv (with Claude Code)

## 1. Context

BuilderKit grew two overlapping front-of-pipeline capabilities in parallel tracks:

- **`product-strategy`** (PR #2, open): `/builderkit:evaluate` (idea → go/no-go +
  MVP spec) **+** `/builderkit:audit` (validated product → ranked, brand-safe build
  list of design plays).
- **`discover`** (PR #1, merged) + **`validate`** (Plan 2, unbuilt): seed → hardened
  hypothesis (symmetric need assessment, multi-agent red-team, reality probe,
  Gate D) → 48h live GTM sprint with a hard cold pay-proof gate (Gate V).

`evaluate` and `discover` overlap at the "should I build this idea" seam (market
scan, wedge, go/no-go, an MVP-spec-shaped output). `audit` is **unique and
complementary** — nothing in discover/validate produces a prioritized build list of
design plays. Decision (chosen): **fold `evaluate` into `discover`; keep `audit` as
the post-validation build planner.** The reconciled chain:

```
idea/seed → /discover → /validate → /audit → /ship → e2e → Linear
            should I    demand      plan the   build
            build it?   real?       build well
```

## 2. Goals / non-goals

**Goals**
- One idea front door (`discover`), one demand test (`validate`), one build planner
  (`audit`). No overlapping "evaluate the idea" stages.
- Preserve every distinct capability: discover's red-team + reality probe, validate's
  cold pay-proof gate, audit's play engine + flagging rules.
- Land with `main` never seeing the redundant `evaluate` (PR #2 is still open).

**Non-goals**
- Building `validate` (still Plan 2).
- Changing the play-engine reference, the red-team personas, or the Gate D/V logic.
- Any third-party-catalog change — the IP posture (engine-only, deck via
  `product.playbook_ref`) is unchanged.

## 3. What `discover` absorbs from `evaluate`

`discover` already covers evaluate's market scan (D1 symmetric assessment), its
critique (D3 red-team incl. the moat/competitor critic), and distribution
(D0 founder-access + the distribution-realist lens). It is missing four evaluate
elements; add them:

1. **Stated exit.** D0 framing and the brief gain a `exit_strategy` field (read from
   `product.exit_strategy`, default "none"). Everything downstream is judged against
   the exit.
2. **Named wedge / defensibility.** The D4 brief gains an explicit `wedge` field —
   "is it a *position* (defensible) or a *feature* (not); would an incumbent
   structurally avoid copying it?" — recorded to `product.positioning`. The D3 moat
   critic already pressure-tests it; this makes the output explicit.
3. **Exit-safe framing check.** The D4 brief gains a short names/claims/trademark
   check against the exit (an acquirer finds it clean, not litigious/manipulative).
4. **Solution & intended-surfaces sketch.** The D4 brief gains a light list of the
   intended product surfaces/screens so `/audit` has something to map plays onto
   downstream.

`discover` starts reading the shared `product:` config block
(`exit_strategy`, `positioning`, `sensitive_category`). The Concept Brief +
Hardened Hypothesis Brief remain discover's artifacts; no separate "MVP spec" is
authored at this stage (the prioritized build spec is `audit`'s output — §4).

## 4. What `product-strategy` becomes

- **Drop Part A (Evaluate)** from `skills/product-strategy/SKILL.md`. The skill
  becomes single-purpose: *turn a validated concept into a prioritized, brand-safe
  build list.* (Keep the skill directory/name `product-strategy` — it is now the
  build-planning module — to avoid churn.)
- **Retarget the input.** Audit's input changes from "evaluate's A5 MVP spec" to:
  the `discover` Hardened Hypothesis Brief (its solution/surfaces sketch) for a
  not-yet-built concept that has passed `validate`, **or** an existing product's
  surfaces. Update `skills/product-strategy/SKILL.md` Part B preamble and
  `commands/audit.md` wording accordingly.
- **`play-engine.md` is unchanged** (pattern library, strategy/metric tables,
  pairing graph, flagging rules, Insight Loop).
- Audit's output (the ranked play build list) is the actionable build spec each item
  of which feeds `/builderkit:ship` — unchanged.

## 5. `evaluate` removal

- Delete `commands/evaluate.md`.
- Remove Part A and its A0–A5 phases from `skills/product-strategy/SKILL.md`
  (their value now lives in `discover`, §3).
- Remove `evaluate` from the `scripts/lint.sh` `--complete` manifest, the README
  command table, and any README/manifest prose that lists it.
- No deprecation alias (PR #2 is unmerged — `main` never ships `evaluate`).

## 6. Config

The `product:` block stays (added in PR #2) and is now **shared**: `discover` reads
`exit_strategy`/`positioning`/`sensitive_category`; `audit` reads all of it incl.
`surfaces`/`playbook_ref`. No new keys. `modules.product` stays true (it powers
`audit`). `studio-setup`'s provisioning paragraph (which mentions the product block)
stays; it already covers capture.

## 7. Handoff contracts (the seams)

- `discover` → `validate`: the Hardened Hypothesis Brief (now exit/wedge/framing/
  surfaces-aware). Unchanged path; richer content.
- `validate` → `audit`: on Gate V pass, the validated concept + the brief's
  surfaces sketch are `audit`'s input. (When `validate` is built in Plan 2, its
  Validation Report references the brief; `audit` reads both.)
- `audit` → `ship`: the ranked play build list; each item → `/builderkit:ship`.
- For an **already-built** product, `audit` can still run standalone against live
  surfaces (no discover/validate required) — preserved.

## 8. Files touched

**Edit**
- `skills/discover/SKILL.md` — D0 exit; D4 brief gains wedge + exit-safe framing +
  surfaces sketch; read the `product:` block; note downstream `audit`.
- `templates/discover/hypothesis-brief.md` — add `exit`, `wedge`, `exit-safe
  framing check`, `intended surfaces` fields.
- `skills/product-strategy/SKILL.md` — drop Part A; retarget Part B input; update
  the description frontmatter (no longer "evaluate").
- `commands/audit.md` — input wording (discover brief / validated concept / existing
  product).
- `README.md` — single chain (discover → validate → audit → ship); drop the
  `evaluate` row + the separate "evaluate" framing; keep one coherent narrative.
- `templates/config.template.yaml` — comment tweaks only (the `product:` block now
  serves discover too); no key changes.
- `scripts/lint.sh` — drop `commands/evaluate.md` from the `--complete` manifest.
- `.claude-plugin/plugin.json`, `marketplace.json` — descriptions reflect the single
  chain (drop "evaluate" as a separate front-end; keep audit + discover/validate).

**Delete**
- `commands/evaluate.md`

**Unchanged**
- `skills/product-strategy/reference/play-engine.md`
- `skills/discover/references/*` (red-team, demand rubric, reality probe)
- `templates/studio/*`, `.gitignore`

## 9. Where it lands (git)

Do the work **on the existing `feat/product-strategy` branch** and **update PR #2**.
Net: PR #2 changes from "add product-strategy (evaluate + audit)" to "add audit +
reconcile the front-ends (fold evaluate into discover)." `main` never sees a
redundant `evaluate`. PR #1 (discover) is already merged; the discover edits in §8
ride in PR #2 on top of merged main.

## 10. Verification

- `scripts/lint.sh --complete` → `lint OK` (manifest no longer lists evaluate;
  lists audit + product-strategy).
- `grep -rn '{{' skills/ commands/` → empty.
- IP scan clean (no `bartek`/`marzec`/handle/deck-title).
- No `evaluate` references remain in skills/commands/README/manifests/lint.
- `discover` SKILL + brief template cross-references still resolve.
- Cross-check: the four absorbed bits (§3) each appear in both the discover SKILL and
  the brief template.

## 11. Out of scope / follow-ups

- Building `validate` (Plan 2) — its Validation Report → audit handoff is specified
  here but implemented later.
- Medium-tier discover/validate review findings (other spec §10) — unchanged.
