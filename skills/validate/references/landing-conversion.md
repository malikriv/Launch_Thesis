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
