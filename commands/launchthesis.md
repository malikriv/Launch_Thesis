---
description: The one LaunchThesis command — a state-aware concierge that locates your phase, runs the next single step, and pauses. Fallback entry for the bare /launchthesis skill.
argument-hint: [a problem, an idea, or a population — optional seed]
---
Run the LaunchThesis **concierge** (the state-aware router). Read and follow
`${CLAUDE_PLUGIN_ROOT}/SKILL.md` end-to-end — it is the single source of truth for the
routing method. In short:

1. **Orient** (read-only): read `.launchthesis/config.yaml` and the loop artifacts (the
   `*-launch-thesis.md` brief + its `wedge.status`, any `*-strategy.md`, the sprint state
   under `validate.sprints_dir`, any `*-handoff.md`). Missing config → SETUP (cold start).
2. **Locate exactly one phase** — SETUP · DISCOVER (`candidate`/no brief) · STRATEGY
   (`named`, no strategy doc) · VALIDATE (strategy doc + open/needs-poll sprint) · PASS
   (`validated`/handoff) · RE-CUT (`refuted`).
3. **Advance one step** by dispatching that phase's existing skill (`studio-setup`,
   `discover`, `product-strategy`, `validate`); let it run to its natural stop. One step
   per run — the only exception is the cold-start `setup + discover` convenience.
4. **Pause + feedback**: close with where you are → what just happened → the single next
   action → one honest helper note. Never fabricate a verdict; the gate scripts score
   `validate`, not you.

`$ARGUMENTS` is an optional seed (a problem, an idea, or a population). On a true cold
start with no seed, welcome the user and ask for one — that is the normal starting point.
