---
description: Run the LaunchThesis Strategy pass — turn a demand-validated Launch Thesis into the GTM + conversion plays that arm the validation sprint, plus a brand-safety pass
argument-hint: [thesis-or-surface | metric:<name>]
---
Invoke the launchthesis `product-strategy` skill (the Strategy pass) for: $ARGUMENTS.
Read .launchthesis/config.yaml and the engine reference first; load the licensed deck
from product.playbook_ref if set. Input is the /launchthesis:discover Launch Thesis (its
named wedge + surfaces sketch) for a pulse-confirmed concept, or an existing product's
surfaces. Runs after Gate D and before the /launchthesis:validate sprint — its
conversion/growth plays feed that sprint's asset + GTM, and its declined plays become the
sprint's brand-safety guardrails. No args → run the Strategy pass over the whole product
from its thesis/surfaces. `metric:<name>` → run the Insight Loop. Output a strategy doc in
docs.specs_dir.
