import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateScope, topoWaves } from "./scope-check.mjs";

// End-to-end scenario: a realistic, RECONCILED build plan as /builderkit:ship Phase 0 would
// produce it — the audit DAG with `scope_origin`/`delivers` filled in from the validate
// sold-scope. This is the data contract the skill instructions must satisfy; it exercises
// shapes the unit tests don't (a sold dependency that delivers nothing directly, and the
// wave layering ship executes). Product: a freelancer invoicing tool whose converting page
// promised two things — one-tap invoice from a tracked session (d1) and a fast payout (d2).

const contract = {
  slug: "fastvoice",
  deliverables: [
    { id: "d1", title: "one-tap invoice from a tracked session" },
    { id: "d2", title: "payout initiated within 2 days" },
  ],
  price: 19,
  paid_cohort_count: 12,
  max_days_to_first_access: 21,
};

// Reconciled plan: auth is `sold` (on the critical path) but delivers nothing on its own;
// the two feature items deliver d1/d2; referral + urgency are post-sale expansion, and the
// urgency play was flagged `decline` by the brand audit.
const plan = [
  { id: "auth", tier: "P0", scope_origin: "sold", delivers: [], depends_on: [], complexity: 3 },
  { id: "invoice", tier: "P0", scope_origin: "sold", delivers: ["d1"], depends_on: ["auth"], complexity: 4 },
  { id: "payout", tier: "P0", scope_origin: "sold", delivers: ["d2"], depends_on: ["invoice"], complexity: 4 },
  { id: "referral", tier: "P2", scope_origin: "expansion", delivers: [], depends_on: ["payout"], complexity: 2 },
  { id: "urgency", tier: "P2", scope_origin: "expansion", delivers: [], depends_on: [], complexity: 1, decline: "fake scarcity countdown" },
];

test("first slice = exactly the sold promise PASSes within the window", () => {
  const r = evaluateScope({ plan, slice: ["auth", "invoice", "payout"], estimated_build_days: 14 }, contract);
  assert.equal(r.verdict, "PASS");
  assert.equal(r.warnings.length, 0, `unexpected warnings: ${r.warnings.join("; ")}`);
});

test("coverage holds even though the sold `auth` item delivers nothing directly", () => {
  // Drop the two feature items' delivery mapping to confirm the check tracks deliverables,
  // not merely the count of sold items.
  const broken = plan.map((i) => (i.id === "payout" ? { ...i, delivers: [] } : i));
  const r = evaluateScope({ plan: broken, slice: ["auth", "invoice", "payout"] }, contract);
  assert.equal(r.verdict, "UNDER-SCOPED");
  assert.match(r.reasons[0], /d2/);
});

test("shipping a growth play before the sold payout is DRIFT", () => {
  const r = evaluateScope({ plan, slice: ["auth", "invoice", "referral"] }, contract);
  assert.equal(r.verdict, "DRIFT");
  assert.match(r.reasons[0], /referral/);
  assert.match(r.reasons[0], /payout/);
});

test("the brand-declined urgency play can never enter a slice", () => {
  const r = evaluateScope({ plan, slice: ["auth", "invoice", "payout", "urgency"], estimated_build_days: 14 }, contract);
  assert.equal(r.verdict, "DECLINED-PLAY-SCHEDULED");
  assert.match(r.reasons[0], /urgency/);
});

test("a 28-day estimate breaches the 21-day first-access commitment", () => {
  const r = evaluateScope({ plan, slice: ["auth", "invoice", "payout"], estimated_build_days: 28 }, contract);
  assert.equal(r.verdict, "DEADLINE-RISK");
});

test("ship waves the reconciled plan in dependency order", () => {
  const { waves, cycle } = topoWaves(plan);
  assert.equal(cycle, null);
  // urgency has no deps so it joins wave 1 with auth; the sold critical path is sequential.
  assert.deepEqual(waves, [["auth", "urgency"], ["invoice"], ["payout"], ["referral"]]);
});
