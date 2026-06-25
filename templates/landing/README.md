# templates/landing — the validate conversion asset

A provider-shaped scaffold for the 48-hour validation sprint. Copy into your project,
fill the `{{TOKENS}}` from `.launchthesis/config.yaml` + the discover brief, wire the two
connectors, deploy.

## Two ways to get a page
1. **Fast-start (`page.template.html`)** — a polished, self-contained, Narro-style launch
   page. Copy it, replace the `{{TOKENS}}` (see `page.tokens.example.json` for a complete
   filled example), review against the conversion rubric, deploy. Minutes, no build step.
   Best when you want a reputable page *now* and will tune the copy by hand.
2. **Build-your-own (`wiring-reference.html`)** — the minimal WIRING REFERENCE (not a
   launch page): shows how a page calls `capture()` / `recordLand()` / `startPreauth()`.
   You design the page in your own tool and reuse this wiring. Best when conversion craft
   is the whole point and you want full control.

Both wire to the **same** capture + WTP probe, so Gate V scores identically either way.
The fast-start is an opt-in convenience — it does **not** remove the human review step:
you still must clear `skills/validate/references/landing-conversion.md`'s rubric and the
honesty floor before launch.

## Pieces
- `page.template.html` — the fast-start launch page (token-driven, single file, mobile-first).
- `page.tokens.example.json` — every `{{TOKEN}}` with a complete worked example to copy from.
- `wiring-reference.html` — the minimal wiring reference for a build-your-own page.
- `capture.js` — cookieless, idempotent client capture; cohort from the link's `?src=`.
- `schema.sql` — the `launchthesis_events` table (unique `dedupe_key` = idempotency).
- `payment-intent.mjs` — the HARD signal: a Stripe manual-capture **pre-auth** (no money moves).
- `gate-eval.mjs` — recomputes the Gate V verdict from the raw rows (see below).
- `gate-run.mjs` — the canonical Gate V scorer CLI (`node gate-run.mjs --export rows.json
  --gate gate.json --price N --window-start <s> --window-end <e> [--lands N]`).
- `server/capture.route.mjs`, `server/preauth.route.mjs` — copy-paste reference backends
  for `/api/capture` (Supabase insert) and `/api/preauth` (Stripe manual-capture hold).
- `privacy.md` — fill-in privacy/consent.

## Wiring (from config)
- `validate.deploy.*` → where your built page is hosted (e.g. Vercel static).
- `validate.data.*` → `STORE_ENDPOINT` in `capture.js` + apply `schema.sql`.
- `validate.payments.*` → `STRIPE_PUBLISHABLE_KEY` + the `/api/preauth` route.

## Planner-mode (constraint C2)
Any connector left blank degrades gracefully: with no payments connector, the reserve
button records a SOFT intent only and the founder collects a pre-sell/LOI by hand; with
no data connector, the founder reconciles signups from a form/CSV export. The Gate V
verdict is then computed by running `gate-eval.mjs` over the hand-collected rows.

## Scoring the gate
Run `gate-run.mjs` (above) — it builds the nested predicates from `validate.gate`
(computing `min_amount` from the D2 price), derives `lands` from in-window `land` rows,
calls `gate-eval.mjs`, and prints the verdict + counted rows so a human or a separate
agent can reproduce it. It WARNS if 0 rows fall in-window (a timestamp-units mistake).
The builder is never the sole scorer (spec C6).
