---
description: Run the BuilderKit ThinkTank evaluation on a raw product idea (go/no-go + MVP spec)
argument-hint: <the idea to evaluate>
---
Invoke the builderkit `product-strategy` skill, Part A (Evaluate), for:
$ARGUMENTS. Read .builderkit/config.yaml first; if the `product:` block is
missing, the skill self-provisions it (no need to run /builderkit:setup). End
with a build / refine / shelve recommendation, and if "build", point at
/builderkit:audit for the play audit.
