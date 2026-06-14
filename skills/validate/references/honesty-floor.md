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
