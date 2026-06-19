---
name: launchthesis
description: >
  The ONE command for LaunchThesis — a state-aware concierge. Run /launchthesis any time
  and it locates where you are in the Refine → Research → Strategy → Validate loop, tells
  you what just happened and what's next, runs the next single step, then stops. The user
  never has to remember setup → discover → strategy → validate, or which one comes next.
  Cold start is the normal case: an idea (or a problem, or an audience) is enough — no app
  required. Dispatches the existing launchthesis skills (studio-setup, discover,
  product-strategy, validate); it never re-implements their logic. Use this whenever the
  user wants to start, resume, or "just continue" — e.g. "/launchthesis", "validate my
  idea", "where am I", "what's next", or hands you a seed with no command.
---

# /launchthesis — the one command (state-aware concierge)

The single front door. Run `/launchthesis` and it figures out where you are, reports it
in plain words, runs the next step, and stops. You never have to remember the four-step
sequence or which command comes next — this one routes you.

> The four named commands still exist as escape hatches for power users:
> `/launchthesis:setup`, `/launchthesis:discover <seed>`, `/launchthesis:strategy`,
> `/launchthesis:validate`. The concierge dispatches to those same skills — it is a
> router, not a second implementation. Each skill stays the single source of truth for
> its own phase.

## The contract (every run)

1. **Orient** — read state (read-only), locate the current phase.
2. **Report** — show the progress line + what just happened, in plain words.
3. **Advance ONE step** — dispatch the right skill for the current phase and let it run
   to its natural stop. Never chain into the next loop phase in the same run.
4. **Pause + feedback** — close with the standard block: what just happened → the single
   next action → one honest helper note. Stop. The user re-runs `/launchthesis` to go on.

**One step, then pause.** Each run advances exactly one phase of the loop. The gates are
real and several steps need the human to act (spend money, build a page, post) — so the
concierge stops at every boundary and hands control back. (The one narrow exception is the
cold-start convenience in Step 3.)

## Step 1 — Orient (read state, cheap + read-only)

Read, in order, stopping as soon as the phase is unambiguous:

- `.launchthesis/config.yaml` — if **missing → SETUP** (cold start). If present, read
  `docs.specs_dir`, `studio.dir`, `validate.sprints_dir`, and `product.positioning`.
- The Launch Thesis brief `<specs_dir>/*-launch-thesis.md` (latest by date) — read the
  versioned `wedge.status` (`candidate | named | validated | refuted`) and the Gate D
  verdict. This brief is the source of truth for the wedge.
- The strategy doc `<specs_dir>/*-strategy.md` — present?
- The sprint state `<validate.sprints_dir>/*.yaml` — `gate_status`, window bounds,
  `abandoned_at`, fail attribution.
- The handoff `<specs_dir>/*-handoff.md` — present (a PASS happened)?
- The studio playbook `<studio.dir>/playbook.md` — **priors only, advisory; never gate.**

If anything contradicts (e.g. a strategy doc but no brief, or a sprint with no config),
trust the cheapest upstream artifact and route to repair it — do not invent a verdict.

## Step 2 — Phase map (pick exactly ONE)

| State | Phase | Dispatch |
|---|---|---|
| no `config.yaml` | **SETUP** (cold start) | `studio-setup` skill |
| config, no brief — **or** `wedge.status: candidate` (Gate D not yet passed) | **DISCOVER** | `discover` skill with the seed |
| `wedge.status: named`, no strategy doc | **STRATEGY** | `product-strategy` skill |
| strategy doc present, no sprint **or** sprint open / past-window / needs a poll | **VALIDATE** | `validate` skill (resume / poll / evaluate) |
| sprint **FAIL → copy_weak** | **VALIDATE** | `validate` (run the next copy/offer variant) |
| sprint **INCONCLUSIVE → channel_thin** | **VALIDATE** | `validate` (extend once / re-channel — never kick back to discover on thin traffic) |
| `wedge.status: refuted` (sprint **FAIL → wedge_refuted**) | **RE-CUT** | `discover` skill (harden a NEW wedge version, N+1) |
| `wedge.status: validated` **or** handoff present | **PASS / DONE** | surface the handoff; offer to start the next idea |

**First run, no config AND no seed given:** open with a one-screen welcome (what the loop
is, that an honest **NO** is a first-class win, that the only oracle is a cold stranger
paying), then ask for the seed — **a problem, an idea, or a population to serve.** Cold
start is the normal case, not an error.

## Step 3 — Advance ONE step

Dispatch the single skill for the chosen phase and let it run to its natural stopping
point: `discover` runs to Gate D + the brief (or a cheap kill at any tier);
`product-strategy` runs to the strategy doc; `validate` runs until it needs the human to
build the page, post, or poll. **Do not** roll into the next loop phase in the same run.

**Cold-start exception (the only one).** SETUP is pre-loop plumbing, not a loop phase —
it produces nothing the user can act on by itself. So on a true cold start, when a seed is
available (supplied or just collected), run `studio-setup` and then continue straight into
`discover` in the same run. Treat "setup + discover" as the single cold-start step. After
discover, pause as normal.

Never re-implement a skill's logic here, and never re-create sprint infra mid-sprint —
`validate`'s own load-and-branch owns that.

## Step 4 — Report + pause (the feedback block)

Close **every** run with this block, kept tight:

- **Where you are** — the progress line with markers and the step number, e.g.
  `Refine ✓ → Research ✓ → Strategy ◀ you are here → Validate · step 3 of 4`.
- **What just happened** — 1–3 plain-language lines: the verdict / output of the step
  that just ran. Report verdicts faithfully — a kill or a NO-GO is stated as the success
  it is, never softened.
- **What's next** — the single next action: "Run `/launchthesis` again to …".
- **Helper note** — one honest tip or expectation for the upcoming step (see below).

When the step produced a hard verdict, say it straight: the gate scripts score `validate`,
not you (C6) — report `gate-run.mjs` output verbatim, never declare PASS from memory.

## Phase helper notes (surface the relevant one)

- **SETUP** — "No app needed — an idea is enough. I'll write an app-free config; the
  cold-start path is the normal one."
- **DISCOVER** — "Cheapest kills first: this can NO-GO in minutes, and that *is* the
  product working. I do the demand research; you'll give the seed + audience and run a few
  pre-sell DMs so the market — not an opinion — settles it."
- **STRATEGY** — "A GTM + conversion plan, not a build plan. It arms the sprint and flags
  the plays your brand should decline."
- **VALIDATE** — "The real gate. It needs a LIVE-mode Stripe, a data store + host, and a
  landing page **you** build (your strength). ≤ $50 ad cap; aim for ~100–200 cold lands.
  Most honest first sprints come back INCONCLUSIVE (thin traffic) — that's the channel
  under-delivering audience, not the idea failing."
- **PASS / DONE** — "Demand proven. Here's the AI-builder handoff — paste its build prompt
  into your builder. LaunchThesis stops at proven demand: your build, your tickets."
- **RE-CUT / FAIL** — "The market ruled on the *position*, not the idea. Re-cut the wedge
  cheap (new version) and re-test — or stop if the receipts say stop."

## Operating rules

- **Read-only orientation.** Never fabricate or recompute a verdict; the gate scripts are
  the scorer (C6). The studio playbook is advisory priors and can never gate.
- **Dispatch, don't duplicate.** Route to the existing skills; each owns its phase logic.
- **One step per run** — except the documented cold-start setup+discover convenience.
- **Config missing mid-loop → SETUP first**, then resume.
- **`CLAUDE.md` overrides** this skill (and every skill) where they conflict.
- **Honesty floor is non-negotiable** — no softened signal, no fabricated proof, in the
  product or in how you report it.
