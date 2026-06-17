---
description: Run the LaunchThesis 48h validation sprint — prove real cold demand, then emit the AI-builder handoff
argument-hint: [launch-thesis-path | poll | report]
---
Invoke the launchthesis `validate` skill for: $ARGUMENTS. Read .launchthesis/config.yaml
first. Input is the /launchthesis:discover Launch Thesis (post-Gate-D), armed by
/launchthesis:strategy. The kit briefs the conversion page + ships the measurement
plumbing; the HUMAN builds and designs the page. Gate V is recomputed by gate-eval.mjs
from the raw rows (the builder is not the scorer). "poll" advances the sprint cursor;
"report" writes the V4 validation report. On PASS, validate emits the **AI-builder
handoff** — the validated wedge, the sold scope + acceptance criteria, the channels that
converted, and a paste-ready build prompt — to drop straight into your build workflow.
