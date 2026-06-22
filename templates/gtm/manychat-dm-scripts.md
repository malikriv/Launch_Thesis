# Manychat DM scripts — comment-to-DM waitlist (paste-ready)

Drop-in copy for the **"Auto DM link from comments"** Quick Automation. All copy clears the
honesty floor (`skills/validate/references/honesty-floor.md`): real stage stated, no fake
scarcity, no implied-live product, visible opt-out, PII notice before capture.

**Placeholders:** `{{KEYWORD}}` · `{{WEDGE_HOOK}}` (the one-line promise) · `{{RESOURCE}}`
(what you deliver — early-access invite / teardown / manifesto) · `{{LINK}}` (UTM'd per the
play's SOP) · `{{HANDLE}}`. Keep `{{KEYWORD}}` 1:1 with the link's `utm_campaign`/`source`.

---

## 1. Public comment replies (add all 3 — Manychat rotates them)

Rotation keeps replies from looking botted and nudges reach. Keep them human and short.

1. `Sent! 📩 check your DMs`
2. `just slid it into your DMs 👀`
3. `done — it's in your messages. lmk what you think`

> Don't paste the link in the public comment. The DM opt-in is what keeps the send healthy.

---

## 2. Opening DM + qualifying button

The button starts the two-way conversation **and** segments your ICP (see the play's
"qualifying button" section).

> Hey — thanks for commenting **{{KEYWORD}}** 🙌
>
> Quick one before I send it: have you ever shipped something nobody used?
>
> **[ Yep, painfully ]**   **[ Not yet ]**

- **[ Yep, painfully ]** → tag `icp:burned-builder` → go to **§3**.
- **[ Not yet ]** → tag `icp:curious` → go to **§3** (same delivery; the tag just segments
  nurture later).

*(Optional `intent_click` event: log the tap with `tier=intent_click`, `cohort=warm_dm`,
`source={{KEYWORD}}` — signal only, gate weight 0.)*

---

## 3. Email capture (turn this ON — the list is the asset)

> Want me to send **{{RESOURCE}}** + save your spot on the early-access list?
>
> Drop the best email 👇 (just for early access — no spam, leave anytime)

- **PII notice (required):** the "no spam, leave anytime" line is the visible notice. If your
  jurisdiction needs more, link your privacy stub (`templates/landing/privacy.md`).
- On submit → write `{ tier:'signup', cohort:'warm_dm', email, source:'{{KEYWORD}}' }` to the
  capture endpoint, then **§4**.
- If they skip the email → still deliver in **§4** (don't hold value hostage), tag
  `email:skipped`.

---

## 4. Deliver the resource

> Here you go 👉 {{LINK}}
>
> Heads up so I'm straight with you: this is **early access — not built yet**. I'm validating
> {{WEDGE_HOOK}} with real builders before I write a line of code. If it's not for you, just
> reply STOP and I'll leave you alone.

> Honesty-floor checklist for this message: ✅ real stage stated ✅ no fake scarcity ✅ not
> claiming live ✅ opt-out present.

---

## 5. Nurture (3 messages, only if they gave an email)

Space these out (e.g. +1 day, +3 days, +6 days). Value first; the ask comes last and stays
truthful. **Anyone who buys/holds via this thread is `cohort=warm_dm` (0.5) — not a cold
pay-proof.**

**N1 — value, no ask (+1d)**
> Real question while I build this: what's the *last* thing you shipped that flopped — and
> what do you wish you'd known before you started? Genuinely reading every reply.

**N2 — proof of progress (+3d)**
> Update: [one concrete thing — a teardown, a wedge you're testing, a demo clip]. You're on
> the early-access list, so you'll see it before anyone. Anything you'd want it to nail?

**N3 — honest ask (+6d)**
> I'm opening a small early-access round to prove people actually want this before I build it.
> It's a **refundable hold**, not a charge — your way of saying "yes, build it." Want in?
> {{LINK}}?utm_campaign={{KEYWORD}}  · (totally fine to pass — a no helps me too.)

> N3 reflects the default pay-proof = **refundable pre-auth hold** with a disclosed
> cancellation path (honesty floor #3). Never imply the product exists yet.

---

## Tagging cheat-sheet

| Tag | Set when | Used for |
|---|---|---|
| `kw:{{KEYWORD}}` | on entry | per-reel / per-wedge attribution |
| `icp:burned-builder` / `icp:curious` | button tap | nurture segmentation |
| `email:captured` / `email:skipped` | §3 | list quality |
| `optout` | replies STOP | suppression (honor immediately) |
