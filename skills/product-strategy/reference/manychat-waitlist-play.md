# Play — Comment-to-DM waitlist (Manychat)

A GTM/conversion play for the `product-strategy` engine. Same card anatomy as
`play-engine.md` (**Mechanic · Why it works · When · Do/Don't · Pairs with · In practice ·
Maps to**), plus the LaunchThesis-specific **cohort/gate wiring** that keeps it honest.

> **One-line standing:** this play builds the **warm floor** — it manufactures *warm_dm*
> leads at volume and gives you clean per-creative attribution. It does **not**, on its own,
> produce the cold pay-proof the gate requires. Plan a cold lane alongside it from day one.

---

## The card

- **Mechanic.** Post a reel/story whose CTA is *"comment ONE WORD."* A Manychat **"Auto DM
  link from comments" Quick Automation** detects the keyword, posts a randomized public
  reply, opens a DM with a button, optionally captures an email, then delivers the promised
  resource. The hand-raise (the comment) flips the contact from cold to warm without you
  sending a single outbound DM.
- **Why it works.** It converts your single best organic moment — someone interested enough
  to comment — into a captured, segmented contact, 24/7. Comments also feed reach, so the
  ask that captures the lead also amplifies the post that produced it.
- **When.** Pre-revenue, audience-building, and especially the run-up to a `validate` sprint
  when you want a named list (`validate.gtm.named_list_target`, default 30) primed before the
  clock starts. Strongest when you can post repeatedly and let creative compound.
- **Do / Don't.**
  - **Do** set one automation **per reel, right before posting** (Marshall's *Next Reel*
    step); use a **distinct keyword per wedge angle** so each reel is an attribution channel;
    make email capture **mandatory** (the list *is* the asset); UTM the delivered link.
  - **Don't** fake scarcity, imply the product is live, or skip the opt-out. The DM must
    state the real stage: *"early access — not built yet."* (Honesty floor, all five stops.)
- **Pairs with.** *Honest limited offer* (real deadlines only), *Intent declaration* (the
  qualifying button below), *Outcome-oriented copy* (button labels), *Deep linking* (land the
  tap one step from value). In the validate sprint it pairs with the guerrilla **named-list**
  job and the **borrowed-distribution** channel.
- **In practice.** *Stop spending your energy on outbound. Spend it on one reel that makes
  the right stranger raise their hand — then let the automation do the part you'd do badly at
  3am anyway. A comment you earned converts better than a DM you forced.*
- **Maps to (surfaces).** Reels/Posts → keyword in **comments** (primary reach + attribution,
  P0). Stories → keyword in **story replies / sticker taps** (warm re-engagement of existing
  followers, P1). Bio/ad link → **DM keyword** destination (P1).

---

## The LaunchThesis upgrade: the qualifying button

Marshall's button just kicks off the two-way conversation so the link send isn't throttled.
**Make that tap earn its keep as research.** Replace "Send it 👇" with a one-tap question
that segments your *actual* ICP from the merely-curious:

> *"Quick one before I send it — have you ever shipped something nobody used?"*
> **[ Yep, painfully ]**  ·  **[ Not yet ]**

The "[ Yep, painfully ]" tappers are burned-builder ICP (see the wedge in the launch-thesis
brief). Tag them. That single tap is an `intent_click`-tier signal (gate weight 0 — **signal,
not proof**) and a free ICP filter that makes the eventual pay-proof ask land on the right
people. This is the *Intent declaration* / *Investment* play doing double duty.

---

## Cohort & gate wiring (the honest part)

Every contact that travels through the **DM relationship** is, by definition, **warm**. Map
it accordingly — do not launder it into the cold count.

| What happened | `cohort` | gate weight | Job |
|---|---|---|---|
| Reel → comment → **DM** → email/nurture | `warm_dm` | **0.5** | Build the named-list floor |
| Reel reaches a **non-follower** who taps a **public** tracked link directly (no DM relationship) | `cold_public` | **1.0** | Can clear the gate |
| The qualifying-button tap | (`intent_click` tier) | 0 | ICP signal + segmentation |

Consequences, straight from `validate.gate` config:

- `cohort_weights.warm_dm = 0.5`, and `min_cold_weight_fraction = 0.6` — so a waitlist of
  warm DMs, however large, **cannot pass the gate by itself**. A warm buyer is not a cold
  buyer (Manifesto #4).
- Therefore run **two lanes off the same content:**
  - **Lane A — warm builder (this play).** Keyword → DM → email → nurture → `cohort=warm_dm`.
    Fills the named list toward `named_list_target`.
  - **Lane B — cold proof.** Drive *non-follower* reach to the **public** page on
    `?src=cold_public` (UTM'd), with **no** DM hand-holding. This is the lane that produces a
    gate-clearing pay-proof. Keep it arm's-length on purpose — the moment you nurture them in
    DMs, they're warm, and you must reclassify them.
- **Attribution plumbing.** keyword → `source`/UTM on the delivered link → landing
  `capture` writes `{ tier, cohort, source, session, email }` into `launchthesis_events`
  (see `templates/landing/schema.sql`). `gate-eval.mjs` recomputes the verdict from those raw
  rows — so the builder is never the scorer (Manifesto #5). Keep keyword↔`source` 1:1 so
  per-reel conversion is readable.

---

## Per-reel SOP (≈5 min, repeatable)

1. Draft the reel + keyword from the content engine (`templates/gtm/content-engine-prompt.md`).
2. In Manychat: **Quick Automation → "Auto DM link from comments" → Next Reel.**
3. Set the **keyword** = this reel's wedge-angle tag (e.g. `FLOP`, `VALIDATE`, `BUILD`).
4. Paste the **3 randomized comment replies** (`templates/gtm/manychat-dm-scripts.md`).
5. Paste the **opening DM + qualifying button**; turn email capture **on**.
6. Set the **delivered link** with `?utm_source=ig&utm_medium=dm&utm_campaign=<keyword>` (Lane
   A → `cohort=warm_dm`). For the Lane-B cold link use `?src=cold_public&utm_campaign=<keyword>`.
7. Post the reel. Log keyword → wedge-angle in the studio so creative learning compounds.

## Insight loop

Post → read per-keyword **comment→DM**, **DM→email**, **email→land**, **land→pay** by
`source` → regenerate more of the winning wedge angle, re-cut the losers (Manifesto #9).
This is Refine→Strategy→Validate expressed as content. Winning angles and dead ones both feed
the studio playbook (Manifesto #11).
