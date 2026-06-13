---
description: Run a BuilderKit Play Audit — turn a product into a prioritised, brand-safe build list
argument-hint: [product-or-surface | metric:<name>]
---
Invoke the builderkit `product-strategy` skill, Part B (Play Audit), for:
$ARGUMENTS. Read .builderkit/config.yaml first and the engine reference; load the
licensed deck from product.playbook_ref if set. No args → audit the whole product
from its spec/surfaces. `metric:<name>` → run the Insight Loop for that metric.
Output a ranked build list in docs.specs_dir; each item is ready for
/builderkit:ship.
