# Validation Report — {{SLUG}}

> Written by /launchthesis:validate (V4). The verdict is recomputed by gate-eval.mjs from
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
| pay-proof (live=true, amount ≥ min_amount) | | | | |

> A pay-proof row counts ONLY with `live: true` and `amount` ≥ the gate's `min_amount`
> (= `min_pct_of_price%` × the D2 price). An `amount: 0` or `live: false` pay-proof does
> not count — record each pay-proof's `live` and `amount` explicitly.

## Gate V verdict (from gate-eval.mjs)
- Verdict: {{PASS | FAIL | INCONCLUSIVE | NOT-MEASURABLE}}
- Reason: {{REASON}}
- Counted users: {{N}} · weighted: {{W}} · cold-weight fraction: {{CWF}} · friend share: {{FS}}
- Cold hard pay-proof: {{YES | NO}}
- Fail attribution (FAIL only): {{channel_thin | copy_weak | wedge_refuted}}
- Raw counted rows (ts · tier · cohort · predicate satisfied · exclusions applied):
  {{ROWS}}

## Captured cold-user list (the waitlist — GOLD; PII lives in validate.data.*, never studio/)
{{...}}

## Honesty-floor drop-off (the kit's #1 health metric)
- abandoned_at: {{none | pre_pulse | pre_page | pre_lands | pre_launch | mid_window}}
- The **honesty floor** is `pre_page` (founder never built the real converting page) and
  `pre_lands` (page built but no confirmed land ever stored). Drop-off there is the
  make-or-break of vibe-coder fit. Logged to the studio validation-log.

## Handoff
On a PASS, the **AI-builder handoff** is written to
`<docs.specs_dir>/{{SLUG}}-handoff.md` from templates/validate/handoff.md — the
paste-ready build brief. It carries the validated wedge, the sold scope the converting
page promised payers (price {{PRICE}}, paid cohort {{PAID_COHORT_COUNT}}), and the
first-access deadline (= validate.handoff.max_days_to_first_access, {{MAX_DAYS}} days). It
is guidance for the user's own build workflow, not a scope-guard contract.

## Recommendation
{{proceed: emit handoff | iterate-GTM (copy/offer variant before kill) | re-cut wedge → /launchthesis:discover | kill}}
