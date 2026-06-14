---
description: Run the BuilderKit 48h validation sprint — prove real cold demand before building
argument-hint: [hypothesis-brief-path | poll | report]
---
Invoke the builderkit `validate` skill for: $ARGUMENTS. Read .builderkit/config.yaml
first. Input is the /builderkit:discover Hardened Hypothesis Brief (post-Gate-D, planned
by /builderkit:audit). The kit briefs the conversion page + ships the measurement
plumbing; the HUMAN builds and designs the page. Gate V is recomputed by gate-eval.mjs
from the raw rows (the builder is not the scorer). "poll" advances the sprint cursor;
"report" writes the V4 validation report. On PASS, audit's build list feeds
/builderkit:ship.
