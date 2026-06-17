# Launch Thesis — {{SEED_SLUG}}

> Written by /launchthesis:discover (D4). Feeds /launchthesis:strategy then /launchthesis:validate.
> Every claim that clears a red-team kill or establishes the WTP path carries a source +
> retrieval date. Model-opinion claims are labeled as such.

## ICP / population
{{ICP}}  <!-- sharp, not "everyone" -->

## Archetype
{{ARCHETYPE}}  <!-- acute-B2B | prosumer | consumer | marketplace -->

## Stated exit
{{EXIT_STRATEGY}}  <!-- or "none" — everything below is judged against this -->

## Founder access (for THIS seed)
| community | standing (none/lurker/member/contributor/known) | reachable now? |
|-----------|--------------------------------------------------|----------------|

## D1 triage verdict
{{PASS | KILL}}  <!-- wedge? reachable audience? WTP path? exit-safe? -->

## D2 demand smoke — pulse evidence
- Outcome: {{PULSE | NO-PULSE}}
- Pre-sell / LOI / deposit / fake-door signal captured: {{...}}
- Re-frame tried (if first pass was flat): {{...}}

## Problem + intensity (D3)
- Calibrated intensity verdict: {{BURNING | REAL-BUT-TOLERABLE | NICE-TO-HAVE}}
- Confirming evidence (sourced): {{...}}
- Disconfirming evidence (sourced): {{...}}
- Falsification register: what would have proven "no burning need", and was it found?

## Value proposition
{{VALUE_PROP}}

## Wedge (versioned)
<!--
  Source of truth for the wedge. D1 emits a `candidate`; D3 promotes it to `named` and
  writes the object here + mirrors `statement` to product.positioning in config.
  status: candidate | named | validated | refuted.
  A wedge-refuted Gate V FAIL re-cut bumps `version`, marks the prior `refuted` with a
  `refuted_by`, and re-enters D3 (bounded by studio.max_concept_cycles).
-->
```yaml
wedge:
  statement: "{{WEDGE}}"   # one-line differentiated position an incumbent would avoid copying
  version: {{WEDGE_VERSION}}
  status: {{WEDGE_STATUS}}        # candidate | named | validated | refuted
  history:
    - version: {{WEDGE_VERSION}}
      statement: "{{WEDGE}}"
      status: {{WEDGE_STATUS}}
      refuted_by: {{REFUTED_BY}}  # only on a refuted version; else omit
      date: {{WEDGE_DATE}}
```

**Current statement (prose):** {{WEDGE}}
<!-- position vs. feature; why an incumbent would structurally avoid copying it.
     Mirrored to product.positioning in .launchthesis/config.yaml. -->

## Monetization + willingness to pay
- Model + who pays: {{...}}
- Existing-workaround spend: {{...}}  <!-- ASSUMPTION to test in validate, not established WTP -->

## Exit-safe framing check
{{...}}  <!-- names/claims/trademark vs. the stated exit -->

## Riskiest assumptions (ranked, provenance-tagged)
1. {{...}}  [model-opinion | cited-external-source | real-human-contact]

## Intended surfaces sketch (for /launchthesis:strategy)
<!-- the screens/overlays the solution will have, so the Play Strategy can map plays onto them -->
- {{...}}

## Falsifiable validation hypothesis
> If we put {{X}} in front of {{audience Y}} via {{channel Z}}, >= {{N}} cold strangers
> will {{signup | activate | PAY}} within {{window}}.

- Mandatory hard_signal for this concept: {{paid | loi | scarce_action}}
  (non-paid requires one-line justification: {{...}})

## Pre-registered Gate V predicates (frozen at validate V0)
- Exposure denominator (min qualified lands): {{...}}
- What counts as signup / activation / hard pay-proof: {{...}}
- Self/contact exclusion set: {{...}}

## Kill criteria
<!-- the pre-committed conditions under which this concept is killed or kicked back -->
