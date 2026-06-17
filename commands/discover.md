---
description: Take a seed (problem, idea, or population) to a red-team-hardened Launch Thesis brief with a named, versioned wedge
argument-hint: <a problem, an idea, or a population to serve>
---
Invoke the launchthesis `discover` skill with the seed: $ARGUMENTS. Read
.launchthesis/config.yaml first; if missing, run /launchthesis:setup before the
pipeline. The funnel runs cheap-to-expensive (triage → demand smoke → deep
hardening): triage emits a candidate wedge, hardening promotes it to a named,
versioned wedge. It ends by writing a Launch Thesis brief — the source of truth
for the wedge — that /launchthesis:strategy consumes (GTM + conversion plays),
then /launchthesis:validate (real cold-pay-proof sprint).
