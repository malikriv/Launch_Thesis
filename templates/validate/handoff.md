# Validated Launch Thesis — Handoff for {{SLUG}}

> Emitted by /launchthesis:validate on a Gate V **GO** only — the AI-builder-ready build
> brief. Paste the build prompt at the bottom into your builder (Claude Code, Cursor,
> Lovable, v0, Bolt) and go. This is **guidance for your own build workflow, not a
> scope-guard contract** — the kit stops at proven demand; what you build is your call.
> The numbers below earned the GO: a real cold stranger paid for exactly this wedge.

## 1. Verdict + confidence
- **Verdict:** GO
- **Lands (in-window, non-founder, deduped):** {{LANDS}}
- **Cold hard pay-proofs (live=true, amount ≥ min_amount):** {{COLD_PAY_PROOFS}}
- **Cold-weight fraction:** {{COLD_WEIGHT_FRACTION}}
- **Confidence:** {{low | medium | high}} — derived from sample size + cohort quality +
  measurability ({{CONFIDENCE_RATIONALE}}). No vibe; this is the read off the counts.

## 2. The validated thesis + wedge
- **Thesis (one-liner):** {{THESIS_STATEMENT}}
- **Validated wedge (v{{WEDGE_VERSION}}, status: validated):** {{WEDGE_STATEMENT}}

## 3. Build this (the sold scope)
> One entry per deliverable the converting page actually promised payers. This is what the
> market paid for — build exactly this. (Retained "what was sold" shape; guidance only.)

| Deliverable | Acceptance criteria |
|---|---|
| {{DELIVERABLE_1}} | {{ACCEPTANCE_1}} |
| {{DELIVERABLE_2}} | {{ACCEPTANCE_2}} |
| {{DELIVERABLE_N}} | {{ACCEPTANCE_N}} |

- **Price:** {{PRICE}}
- **Paid-cohort count:** {{PAID_COHORT_COUNT}}
- **First-access deadline:** {{FIRST_ACCESS_DEADLINE}} (= validate.handoff.max_days_to_first_access, {{MAX_DAYS}} days)

## 4. Do NOT build this
> The signature block — the "what not to build" the whole product promises. Guardrails the
> build must respect.
- **Unvalidated extras (the market did not pay for these):** {{UNVALIDATED_EXTRAS}}
- **Declined plays (from the strategy brand-safety pass — must respect):** {{DECLINED_PLAYS}}

## 5. Who + how to reach them
- **ICP:** {{ICP}}
- **Channels that actually converted (don't re-guess GTM from scratch):** {{WINNING_CHANNELS}}

## 6. Instrument these
> The metric→play wiring so the app is measurable from day one (seeds the post-launch loop).

| Metric | Wired to play |
|---|---|
| {{METRIC_1}} | {{PLAY_1}} |
| {{METRIC_2}} | {{PLAY_2}} |
| {{METRIC_N}} | {{PLAY_N}} |

## Build prompt (paste-ready — generated from blocks 2–6)
```
Build a {{STACK}} app for {{ICP}} that {{WEDGE_STATEMENT}}.
Scope (the market paid for exactly this):
  - {{DELIVERABLE_1}} — acceptance: {{ACCEPTANCE_1}}
  - {{DELIVERABLE_2}} — acceptance: {{ACCEPTANCE_2}}
  - {{DELIVERABLE_N}} — acceptance: {{ACCEPTANCE_N}}
Do NOT build: {{UNVALIDATED_EXTRAS}}. Must respect: {{DECLINED_PLAYS}}.
Reach users via: {{WINNING_CHANNELS}}. Wire analytics for: {{METRIC_1}}, {{METRIC_2}}, {{METRIC_N}}.
First access promised by: {{FIRST_ACCESS_DEADLINE}}.
```
