# Validation log — one row per discover/validate run

> Append-only. Row key = the run slug. Record LOSERS with the same tags as winners
> (recording only survivors bakes in survivorship bias). Backfill the `outcome`
> column opportunistically when you next run any command — no scheduler.

| slug | date | seed | archetype | icp_type | primary_channel | channel_standing | gate_d | gate_v | funnel (lands/signup/activation/pay) | cold_weight_fraction | founder_hours | decision | outcome | outcome_date |
|------|------|------|-----------|----------|-----------------|------------------|--------|--------|--------------------------------------|----------------------|---------------|----------|---------|--------------|
<!-- outcome ∈ pending | shipped | retained | revenue | killed_in_market | abandoned -->
