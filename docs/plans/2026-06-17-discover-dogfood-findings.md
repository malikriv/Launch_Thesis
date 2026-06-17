# Discover skill — dogfood findings (QA log)

**Date:** 2026-06-17
**Tester:** QA/dogfood agent (no edits to skill/template/command/config/script; no git)
**Seed:** "LaunchThesis itself" — an idea-validation tool for burned indie builders who ship with AI
**Method:** followed `skills/discover/SKILL.md` literally D0 → D1 → D2 → D3 → Gate D → D4,
reading each referenced file and applying the template's real structure.
**Artifact produced:** `docs/specs/2026-06-17-launchthesis-launch-thesis.md` (every `{{TOKEN}}` filled).

Severity scale: **Critical** (blocks/misleads a real user) · **Major** (real friction or
contradiction that survives, but a determined user gets through) · **Minor** (cosmetic /
vocabulary / polish).

---

## Pre-flight — "Config first"

The skill opens with a hard precondition: *"Read `.launchthesis/config.yaml` before D0.
Missing → stop and point the user at `/launchthesis:setup`."* (`SKILL.md:23-26`).

**Finding P1 — `.launchthesis/config.yaml` does not exist in this repo. [Major]**
Only `templates/config.template.yaml` exists; there is no instantiated config and no
`.launchthesis/` directory at all (verified: `find` returns only the template). Followed
literally, the skill must **stop at the door** and refuse to run discover on its own seed.
For a *dogfood of discover*, that is a hard stop before D0. I proceeded by treating the
template's defaults as the config (the only sane path for the exercise), but a real user
running `/launchthesis:discover` in this repo would be bounced to `/launchthesis:setup`
first. This is arguably *correct gating*, but it means **the discover skill cannot be
exercised standalone** — it is fully coupled to setup having run. Worth a one-line note in
the skill that "this is expected; run setup, it takes a minute" so the stop doesn't read
as an error.
*Suggested fix:* none to the gate itself; add a friendlier "expected, not an error"
sentence at `SKILL.md:24`, and/or have the dogfood harness run `/launchthesis:setup` first.

---

## D0 — Frame

**Ran clean.** `SKILL.md:42-50` gives a crisp checklist (sharp ICP, alternatives, why-now,
archetype enum, stated exit, founder-access with per-community standing). Every required
field had an obvious home in the template's top sections (`launch-thesis.md:7-18`). The
archetype enum in the skill (`acute-B2B | prosumer | consumer | marketplace`) matches the
template's enum comment (`launch-thesis.md:11`) exactly. No friction.

**Finding D0-1 — founder-access "standing" vocabulary is consistent but the template's
table has no rows/example. [Minor]**
`SKILL.md:48-49` defines standing as `none/lurker/member/contributor/known`; the template
table header (`launch-thesis.md:16-18`) repeats the same enum — good. But the table ships
with **header only, zero example rows**, so a first-time user has no model for how granular
to be (one row per community? what does "reachable now?" mean — yes/no, or a date?). I
inferred yes/no. Minor; an example row would remove all doubt.

---

## D1 — Triage gate

**Ran clean on substance.** The four questions (`SKILL.md:54-60`) map 1:1 onto the
template's `## D1 triage verdict` block, and the candidate-wedge concept
(`SKILL.md:64-66`) lines up with the wedge object's `status: candidate` start
(`launch-thesis.md:48` comment). The cheap-fix / re-frame guardrail is clear.

**Finding D1-1 — leftover refactor vocabulary: "absorbs the old evaluate". [Minor]**
`SKILL.md:51`: *"## D1 — Triage gate (cheap go/no-go; absorbs the old evaluate)"*. "the old
evaluate" is **internal refactor history**, meaningless to a real user who never saw an
"evaluate" tier. It reads like a leftover migration note.
*Suggested fix:* drop "; absorbs the old evaluate" from the heading at `SKILL.md:51`.

**Finding D1-2 — the candidate wedge is described but the template gives it nowhere to
live until D3. [Minor]**
D1 "emits a candidate wedge" (`SKILL.md:64-66`), but the template's only wedge home
(`launch-thesis.md:37-60`) is filled at D3 (the comment says "D1 emits a `candidate`; D3
promotes it"). So between D1 and D3 the candidate wedge has no slot in the artifact — it
exists only in the agent's head. In a clean single-pass run this is invisible (you write
the brief once, at D4, with the named wedge). But if a user is killed at D2, the candidate
wedge they generated is never recorded anywhere. Minor; would matter for studio learning on
early kills.

---

## D2 — Demand smoke

**Ran clean.** `SKILL.md:68-83` + `references/reality-probe.md` are coherent and mutually
reinforcing: cheap assets only, no landing/Supabase/Stripe stack (explicitly deferred to
validate), Mom-Test framing, the re-frame-once guardrail, the pulse gate. The template's
`## D2 demand smoke — pulse evidence` block (`launch-thesis.md:23-26`) captures exactly the
three things the gate decides (outcome, captured signal, re-frame tried). Config key
`discover.reality_probe.window_hours` referenced in the skill (`SKILL.md:73`) exists in the
template config (`config.template.yaml:34`, as `reality_probe.window_hours: 24`). Solid
hand-off.

**Finding D2-1 — `min_contacts_drafted` vs the reference's "5-10". [Minor]**
`config.template.yaml:34` sets `min_contacts_drafted: 10`. `reality-probe.md:17` says draft
"**Mom-Test pre-sell DMs (5-10)**". 5–10 vs a floor of 10 is a mild numeric mismatch — the
reference's upper bound equals the config floor, so "5" would underfill the config minimum.
Not blocking; a user picking 7 DMs would technically be under the configured floor.
*Suggested fix:* align `reality-probe.md:17` to "(>= 10, per `min_contacts_drafted`)".

---

## D3 — Deep hardening

**Mostly clean, two real vocabulary/tier bugs in the rubric reference.**

The skill body (`SKILL.md:85-107`) is internally consistent: symmetric need assessment via
`Explore`/`Agent`, scored by the rubric; monetization with existing-workaround spend as a
LABELED ASSUMPTION (matches `launch-thesis.md:64` comment); the six red-team personas via
`Workflow`; promote candidate → named with the versioned wedge object + config mirror; the
re-cut N+1 mechanics; exit-safe framing. All of this maps cleanly onto the template.

**Finding D3-1 — `demand-intensity-rubric.md` is tier-stale: says "D1" when the skill
invokes it at D3. [Major]**
`SKILL.md:90-92` invokes the rubric inside **D3** ("Symmetric need assessment … score with
references/demand-intensity-rubric.md"). But the rubric itself opens:
*"**D1** must gather the strongest CONFIRMING **and** DISCONFIRMING evidence…"*
(`demand-intensity-rubric.md:3`). The rubric is pinned to the wrong tier name. A user who
reads the reference is told this is a D1 activity while the skill runs it at D3 — a direct
contradiction about *when* the work happens. Its hand-off line
(`demand-intensity-rubric.md:30-33`) then says "Feed the verdict … into the D3 red-team",
which only makes sense if the rubric itself is *pre-*D3 — reinforcing the stale framing.
*Suggested fix:* change `demand-intensity-rubric.md:3` "D1 must gather" → "D3 must gather"
(or tier-neutral "The need assessment must gather"), and reconcile line 30-33 so the
verdict feeds the red-team *within* D3, not "into D3" from outside.

**Finding D3-2 — stale artifact noun "dossier". [Minor]**
`demand-intensity-rubric.md:26` ("Falsification register (required in the dossier)") and
`:28` ("A dossier that never had a chance to fail…") call the output artifact a **dossier**.
That noun appears nowhere else in the refocused skill set — the artifact is the **Launch
Thesis brief**. Leftover vocabulary from a prior naming.
*Suggested fix:* "dossier" → "Launch Thesis brief" (or "the brief") at both lines.

**Finding D3-3 — falsification register has a home in the template but isn't labeled as
such. [Minor]**
The rubric *requires* a falsification register (`demand-intensity-rubric.md:26-28`). The
template has the line *"Falsification register: what would have proven 'no burning need',
and was it found?"* (`launch-thesis.md:32`) buried as a sub-bullet under "Problem +
intensity". The naming matches, so a careful reader connects them — but it's a sub-bullet,
not a headed block, so it's easy to under-fill. Minor.

**Finding D3-4 — config-mirror step is an instruction the artifact can't self-evidence.
[Major]**
`SKILL.md:100-102` mandates: on promotion, "mirror the current `statement` to
`product.positioning` in `.launchthesis/config.yaml`." In this dogfood that file doesn't
exist (see P1), so the mirror **silently can't happen** — and nothing in the brief or the
skill flags that the mirror was skipped. A real user whose config exists is fine, but the
coupling means: if discover is ever run without a config (the exact precondition the skill
itself tries to enforce), the named wedge is written to the brief but the config mirror
that "arms Strategy + Validate" (`SKILL.md:103`) is silently dropped. The two sources of
truth can desync with no warning.
*Suggested fix:* have D3 explicitly assert "wedge mirrored to product.positioning" (or
"config missing — mirror skipped, run setup") as a checkable line, and/or reconcile with
the P1 hard-stop so this path is unreachable.

**Finding D3-5 — red-team personas reference is excellent and self-consistent. [clean]**
`red-team-personas.md` (six lenses, evidence-bound, provenance tags, correlated-prior
check, the riskiest-assumptions ledger, and a *duplicated* Gate D definition) all match the
skill. Provenance tag enum `{model-opinion | cited-external-source | real-human-contact}`
(`red-team-personas.md:27`) is identical to the template's tag enum
(`launch-thesis.md:70`). No friction applying it. (But see Gate-D-1 on the duplication.)

---

## Gate D — neutral triage

**Substantively clean, one duplication risk.**
The four fail conditions (a)-(d) in `SKILL.md:110-118` are clear, evidence-gated, and map
to a concrete kill-criteria section in the brief. I could mechanically check each: WTP path
(yes), reachable audience (yes, >= 2), top assumption provenance (assumption #1 is
real-human-contact-anchored, not bare model-opinion with no test path → passes), intensity
(burning, not nice-to-have → passes). The gate produced a clean PASS.

**Finding Gate-D-1 — Gate D is defined in TWO places with slightly different wording; risk
of drift. [Major]**
The full (a)-(d) definition lives in `SKILL.md:109-118` **and** is duplicated verbatim-ish
in `red-team-personas.md:37-43`. They agree *today*, but two copies of a gate definition
will drift. The reference copy also embeds the `kill_threshold: evidence_gated` config
value (`red-team-personas.md:37`) which really belongs to config
(`config.template.yaml:33`) — three places now state the same threshold.
*Suggested fix:* make `red-team-personas.md` point to the skill's Gate D section as the
single source rather than restating (a)-(d).

**Finding Gate-D-2 — two different "bound by" knobs for adjacent loops; easy to confuse.
[Minor]**
`SKILL.md:106` bounds the wedge re-cut loop by `studio.max_concept_cycles`; `SKILL.md:118`
bounds Gate D rounds by `discover.red_team.max_rounds`. Both keys exist
(`config.template.yaml:31, 87`) and the distinction is *legitimate* (concept cycles vs
red-team rounds), but a user reading fast will conflate "max rounds" and "max cycles." I
had to read both config lines to keep them straight while writing the Kill criteria. Minor;
a half-sentence distinguishing them would help.

---

## D4 — Launch Thesis brief

**Ran clean; the template is the strongest artifact in the set.**
`SKILL.md:120-128` names the output path pattern, the source template, and the required
contents (stated exit, named versioned wedge, exit-safe check, D2 pulse evidence,
intended-surfaces sketch). Every one of those has a matching section in
`templates/discover/launch-thesis.md`. The versioned-wedge YAML block
(`launch-thesis.md:45-56`) is well-commented and unambiguous about `status`/`version`/
`history`/`refuted_by`. The intended-surfaces sketch (`launch-thesis.md:72-74`) hands off
explicitly to strategy. Filling it produced a coherent, actionable brief with zero
`{{placeholders}}` left.

**Finding D4-1 — output path token mismatch: `<docs.specs_dir>` vs `<docs.specs_dir>`
naming, and config has TWO specs_dir keys. [Minor]**
`SKILL.md:122` writes to `<docs.specs_dir>/YYYY-MM-DD-<slug>-launch-thesis.md`. The config
defines `docs.specs_dir` (`config.template.yaml:10`) **and** a second
`discover.specs_dir` that "reuse[s] docs.specs_dir" (`config.template.yaml:35`). Two keys
for one value invites desync. The skill uses the `docs.` one (correct), but a maintainer
editing only `discover.specs_dir` would have no effect on the brief path. Minor.
*Suggested fix:* drop `discover.specs_dir` and reference `docs.specs_dir` everywhere.

**Finding D4-2 — template header says "/launchthesis:discover (D4)" — good; but the
template's intensity verdict casing differs from the rubric. [Minor]**
Template (`launch-thesis.md:29`) uses `BURNING | REAL-BUT-TOLERABLE | NICE-TO-HAVE`
(upper, hyphenated); the rubric (`demand-intensity-rubric.md:22-24`) uses lowercase
`burning / real-but-tolerable / nice-to-have`. Cosmetic, but a strict tool diffing the two
would see a mismatch. Minor.

---

## Cross-cutting

**Finding X-1 — "hard_signal" plumbing is coherent across template + config. [clean]**
The template's "Mandatory hard_signal … {{paid | loi | scarce_action}}"
(`launch-thesis.md:80-81`) matches config `validate.gate.hard_signal_default: paid` and
`allow_brief_override: true` (`config.template.yaml:52-53`). The Gate-V predicate block
(`launch-thesis.md:83-86`) maps cleanly onto the config gate keys (min_qualified_lands,
pay_proof, exclude_self). The discover→validate hand-off is well-wired. No friction.

**Finding X-2 — no stale "audit" / "hypothesis brief" / "build-first" vocabulary found in
discover. [clean]**
Grepped the skill, references, template, and command for `audit | hypothesis brief |
evaluate | build`. Only legitimate uses remain ("build workarounds", "no-build fake-door",
"BEFORE any build"). The one true leftover is "old evaluate" (D1-1) and "dossier" (D3-2).
The refocus's core vocabulary (wedge / pulse / Launch Thesis / candidate→named) is applied
consistently.

---

## Per-step verdict summary

| Step | Verdict | Worst finding |
|------|---------|---------------|
| Pre-flight (config) | Friction | P1 Major — config gating blocks standalone discover |
| D0 Frame | Clean | D0-1 Minor (no example row) |
| D1 Triage | Clean | D1-1 Minor (leftover "old evaluate") |
| D2 Demand smoke | Clean | D2-1 Minor (5-10 vs floor 10) |
| D3 Hardening | Friction | D3-1 Major (rubric tier-stale "D1"), D3-4 Major (silent mirror skip) |
| Gate D | Clean (substance) | Gate-D-1 Major (duplicated gate def) |
| D4 Brief | Clean | D4-1 Minor (double specs_dir key) |

**Top 3 findings:**
1. **D3-1 [Major]** — `demand-intensity-rubric.md:3` says "D1 must gather…" but the skill
   runs the rubric at **D3**. Direct tier contradiction a reader hits immediately.
2. **Gate-D-1 [Major]** — Gate D is defined twice (`SKILL.md:109-118` and
   `red-team-personas.md:37-43`); two copies of a gate definition will drift.
3. **D3-4 / P1 [Major]** — the mandated config mirror (`SKILL.md:100-102`) and the
   "config first" hard stop (`SKILL.md:23-26`) both assume a `.launchthesis/config.yaml`
   that doesn't exist in this repo; without it the named wedge writes to the brief but the
   `product.positioning` mirror that "arms Strategy + Validate" is silently dropped.

---

## VERDICT

**Yes — with minor edits.** The refocused discover skill produces a coherent Launch Thesis
brief and a named, versioned wedge (`status: named`, `version: 1`, real history entry)
exactly as intended; the D0→D1→D2→D3→Gate D→D4 funnel is logically sound and the
template/config hand-off into strategy and validate is well-wired. The blemishes are real
but non-fatal: one tier-stale reference ("D1 must" in the D3 rubric), one duplicated Gate D
definition at drift risk, a silent config-mirror gap when run without setup, and a handful
of leftover-vocabulary / cosmetic nits. None of them stopped me from producing an
act-on-able brief; all are surgical one-line fixes.
