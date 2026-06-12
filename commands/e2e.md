---
description: Run or scaffold e2e flows per the BuilderKit 4-phase testing system
argument-hint: [smoke|full|new <R-id>]
---
Invoke the builderkit `e2e-testing` skill. "smoke"/"full" → run that pack via
the config commands and report results + evidence paths. "new <R-id>" →
scaffold a per-requirement flow from the driver template and conventions.
No args → report phase status (testing.phases_complete) and available packs.
