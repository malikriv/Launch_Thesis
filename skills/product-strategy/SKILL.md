---
name: product-strategy
description: >
  BuilderKit front-of-pipeline module: decide WHAT to build and in what order,
  then hand off to /builderkit:ship. Part A — Evaluate: the ThinkTank idea
  pipeline (frame → honest market & competitor scan → wedge → distribution →
  exit-safe framing → MVP spec). Part B — Play Audit: run a product-design play
  deck against the product's surfaces (weight strategies → map plays to screens
  → tier P0/P1/P2 → flag brand/exit conflicts → ranked build list), plus a
  metric-first Insight Loop. Reads .builderkit/config.yaml (`product:` block);
  loads the user's licensed play deck from product.playbook_ref when set. Use via
  /builderkit:evaluate <idea> or /builderkit:audit, or whenever the user asks
  "should I build this", "what's the wedge", "what do I build first", or wants a
  play audit / build order before shipping.
---

# /product-strategy — evaluate ideas & plan the build order

BuilderKit ships features well. This module decides *which* features, in *what
order*, and *whether the idea is worth building at all* — then feeds the result
into `/builderkit:ship`. Two parts:

- **Part A — Evaluate**: take a raw idea through the ThinkTank pipeline to an
  honest go/no-go and a structured MVP spec.
- **Part B — Play Audit**: turn a product (or spec) into a prioritised,
  brand-safe build list using a product-design play deck, and run a metric-first
  Insight Loop when a live loop isn't moving.

**Config first.** Read `.builderkit/config.yaml` before either part. This module
reads the `product:` block (`positioning`, `exit_strategy`, `sensitive_category`,
`surfaces`, `playbook_ref`) and writes outputs to `docs.specs_dir`. If the
`product:` block is missing, self-provision it (see "Provisioning" below) — don't
block on `/builderkit:setup` for this module. The project's `CLAUDE.md` overrides
both this skill and the config where they conflict.

**Engine.** The skill is **self-sufficient** — it ships a complete built-in pattern library,
the strategy/metric tables, the flagging rules, and the method in
`${CLAUDE_PLUGIN_ROOT}/skills/product-strategy/reference/play-engine.md`. Read it before
Part B. A user never has to supply a deck. `product.playbook_ref` is an **optional override**:
if it points at a deck reference the user licenses and keeps outside this plugin, the skill
may additionally consult it for that deck's specific named plays and pairings — but the
audit runs fully without it.

## Operating rules (apply to both parts)

- **Honest first.** Real research, real competitors, and the case *against*
  building come before the case for. A flattering evaluation is a failed one.
- **Distribution before tech.** How it reaches its first 100 users is part of the
  evaluation, not an afterthought — and it determines which plays are P0 (e.g. a
  shareable artifact makes a sharing play P0).
- **Exit-aligned framing.** Names, claims, and trademarks must be safe for
  `product.exit_strategy` from day one.
- **No dark patterns by default.** Decline manipulation-adjacent plays the wedge
  rejects, and *write down why* — especially when `product.sensitive_category` is
  true. Skipping plays is a deliverable.
- **Write things down.** Evaluations and audits land as docs in `docs.specs_dir`,
  not just chat. Future sessions and `/builderkit:ship` read docs.
- **Report honestly.** If research couldn't be run (no network, blocked source),
  say so in the doc — never imply a scan happened when it didn't.

---

## Part A — Evaluate (ThinkTank pipeline)

Produce a go/no-go and, if go, a structured MVP spec. Six phases; for a small
idea each shrinks to a few lines, but each still happens and gets written down.

### A0 — Frame
One-sentence idea, target user, and the **stated exit** (or "none"). Everything
downstream is judged against the exit. Record it to `product.exit_strategy` if
not already set.

### A1 — Honest market & competitor scan
Real research. Capture incumbents and adjacents, what each does well, and where
users complain. Then write the **case against building** before the case for. If
the idea survives that, continue. (Note any source that couldn't be reached.)

### A2 — The wedge
Name the one differentiated thing. Test it: would an incumbent structurally avoid
copying it (business-model, brand, or data-policy conflict)? Is it a *position*
(defensible) or just a *feature* (not)? Record the wedge to `product.positioning`.

### A3 — Solo-founder fit & distribution
Can one person build and maintain the P0? Cut scope until yes. Where do the first
100 users come from with no paid acquisition? No organic answer → not ready. The
channel feeds Part B's P0 selection.

### A4 — Exit-safe framing
Check names, claims, and coined terms against the exit (e.g. trademark search on
invented names). Positioning an acquirer finds clean, not litigious or
manipulative.

### A5 — MVP spec
Write `docs.specs_dir/<idea>-spec.md`: goals / non-goals, architecture, P0/P1/P2,
acceptance criteria, safety, analytics, build phases. This is the standard
BuilderKit spec the ship pipeline consumes.

**Output:** an evaluation note (A0–A4) + the MVP spec. End with a recommendation:
**build / refine / shelve**, and if build, point at Part B for the play audit.

---

## Part B — Play Audit → the build list

Turn a product (or the A5 spec) into a ranked, brand-safe build list. Read the
engine reference first (it stands alone); consult `product.playbook_ref` too only
if it is set.

### B1 — Weight the strategies
Score the 12 strategy families Critical / High / Medium / Later for *this*
product, using the weighting rubric in the engine reference. State the rationale
in one line each. Don't treat them equally.

### B2 — Map plays to surfaces
For each surface (use `product.surfaces` if set, else enumerate the product's
screens/overlays from the spec or repo), list which plays apply and write a
concrete **"where it goes."** Credit plays the product *already* implements so
they aren't rebuilt.

### B3 — Tier P0 / P1 / P2
P0 = the core loop doesn't work without it. P1 = deepens the loop / earns the
premium feel / controlled growth. P2 = monetisation & growth after the loop is
validated.

### B4 — Flag conflicts
Walk the flagging rules against the wedge and `product.sensitive_category`. For
each manipulation-adjacent or off-brand play, decide **use as-is / constrain
(how) / skip (why)**. This section is mandatory, even if short.

### B5 — Ranked build list
Emit the ordered "do this first" sequence (8–12 items). This is the spec's
P0/P1/P2 expressed as plays — keep the two in sync.

### B6 — Wire the Insight Loop
Fill the metric → play table (engine reference) so every build-list item is
measurable.

**Output:** `docs.specs_dir/<product>-play-audit.md` (B1 weights → B2 surface
maps → B4 flags → B5 build list → B6 metrics). Each build-list item is ready to
become a `/builderkit:ship <item>` run; acceptance criteria for each come from
B2's "where it goes" + the wired metric.

### Insight Loop (metric-first mode)
When a live product's loop isn't moving, or to make a build list measurable:
1. Pick **one** metric to improve.
2. Read that strategy's "what's driving this?" questions (engine reference, or the
   licensed deck's analysis groupings).
3. Match findings to the play family that kills the friction.
4. Ship **one** play (`/builderkit:ship`), then re-measure — never batch, or you
   won't know what moved the needle.

---

## Handoff to delivery

The Play Audit's build list is the bridge to the rest of BuilderKit:
`/builderkit:ship <build-list item>` runs each one through the 8-phase pipeline;
acceptance criteria come from the audit's per-item "where it goes" + metric;
verification and Linear journaling proceed as normal. Evaluation → audit → ship →
e2e → Linear is the full studio loop, front to back.

---

## Provisioning (`product:` config block)

If the `product:` block is missing or empty when either part runs, capture it
before proceeding (idempotent, like `/builderkit:setup`). Ask one consolidated
question for:

- `positioning` — one-line wedge / brand stance (or derive it from Part A's A2).
- `exit_strategy` — stated exit, or "none".
- `sensitive_category` — true/false (health, finance, self-image, minors, etc.).
- `surfaces` — known screens/overlays (optional; can be filled from the spec/repo).
- `playbook_ref` — **optional**. Path to a deck reference the user licenses and
  keeps outside this plugin. Leave empty; the built-in engine is self-sufficient.

Show the resulting block and write it into `.builderkit/config.yaml` under
`product:`, and set `modules.product: true`. Never overwrite an existing block
without showing a diff first.
