# Content engine — keyword-CTA reels & stories from the named wedge

A reusable Claude prompt that mass-produces the *raw material* the comment-to-DM play needs:
reel scripts + captions + story sequences, each one an A/B test of a **wedge angle**, each
ending in a keyword CTA. The automation is trivial to set up; content volume is the
bottleneck — this removes it.

**How to use:** fill the input contract from your `.launchthesis/config.yaml`
(`product.positioning`) and the current launch-thesis brief (named wedge + ICP), paste the
prompt into Claude, post the winners, and let the insight loop pick what to scale.

---

## Input contract

```yaml
wedge:        # the named wedge (subject of the thesis) — from the launch-thesis brief
icp:          # who it's for, in their own words (e.g. burned indie/vibe-coder who launched to silence)
pain_quotes:  # 3–5 real phrases from the discover dossier (complainers/reviewers/forum posts)
resource:     # what the DM delivers (early-access invite / "why your launch flopped" teardown / manifesto)
n_angles:     # how many distinct wedge angles to generate (default 5)
stage_line:   # the honest stage, e.g. "early access — not built yet"
forbidden:    # plays the brand declines (fake scarcity, manipulative urgency, implied-live, ...)
```

---

## The prompt (paste into Claude)

> You are a short-form content writer for an honest, pre-launch founder. You will produce
> social content that drives the right strangers to comment a keyword, which triggers a DM
> opt-in waitlist. Read the input contract above as ground truth.
>
> **Generate `n_angles` distinct WEDGE ANGLES.** Each angle reframes the *same* wedge for a
> different felt pain from `pain_quotes` (e.g. wasted-weeks, building-the-wrong-thing,
> can't-tell-if-anyone-wants-it, afraid-to-launch-again). For **each** angle output:
>
> 1. **Angle name** + the pain it hits + a unique **KEYWORD** (one word, ALL CAPS, memorable,
>    1:1 with this angle for attribution — e.g. FLOP, SILENCE, VALIDATE, PROOF).
> 2. **Reel script (15–30s):** a scroll-stopping **hook** (first 2s, uses the audience's own
>    words), 3–5 punchy beats, and a **CTA**: *"comment {KEYWORD} and I'll send you {resource}."*
> 3. **Caption:** 2–4 lines + the same comment CTA + 3–5 relevant hashtags.
> 4. **Story sequence (3 frames):** building-in-public micro-arc (tease → proof/insight →
>    "comment {KEYWORD} / tap to get {resource}"), each frame ≤ 12 words on screen.
>
> **Rules (hard):**
> - Truthful stage only — say `stage_line`; never imply the product is live or built.
> - No fabricated proof, metrics, or social proof. No fake scarcity or manufactured urgency.
>   Honor everything in `forbidden`. If a punchier line would require crossing one of these,
>   write the honest version instead and note what you declined and why (declining a
>   manipulative play is a deliverable).
> - One keyword per angle; keep it consistent across reel + caption + story so attribution
>   stays clean.
> - Voice: direct, builder-to-builder, a little dry. No hype, no emojis-as-personality, no
>   "🚀 game-changer" tone.
>
> **Output format:** one markdown block per angle, in this order: `Angle`, `Keyword`,
> `Reel script`, `Caption`, `Story (3 frames)`. End with a one-row **attribution table**
> mapping each `Keyword → angle → pain`.

---

## After generation

- Set one Manychat automation per reel (`templates/gtm/manychat-dm-scripts.md`), keyword =
  the angle's KEYWORD, delivered link UTM'd with `utm_campaign=<KEYWORD>`.
- Track **comment→DM → DM→email → email→land → land→pay** by `source` (= keyword). Scale the
  winning angle, re-cut the losers — don't quit the wedge (Manifesto #9).
- Remember the lanes: this content fills the **warm_dm** floor. To clear the gate, point some
  **non-follower** reach at the **public** `?src=cold_public` link with no DM nurture (see
  `skills/product-strategy/reference/manychat-waitlist-play.md`).
- Log winning + dead angles to the studio playbook so the next idea starts smarter
  (Manifesto #11).
