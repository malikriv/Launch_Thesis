# BuilderKit

BuilderKit is an app-studio delivery orchestrator for Claude Code. It bundles two complementary front-of-pipeline paths — a **product-strategy front-end** (ThinkTank idea evaluation + a product-design Play Audit that turns a product into a ranked build list) and a **discover → validate** track (hypothesis hardening + a 48h guerrilla validation sprint) — plus a production-grade **ship-feature pipeline**, a **4-phase end-to-end testing system** (Maestro for Expo/iOS, Playwright for web), and **Linear integration**, all in one plugin — born from a production app's battle-tested workflow and generalized so any project can adopt it. Everything is driven by a per-project config at `.builderkit/config.yaml`, so the same skills work across stacks without hard-coding a single project literal.

The full studio loop runs front to back: **evaluate** an idea → **audit** it into a prioritised build list → **ship** each item → **e2e** gate it → journal it in **Linear**. The **discover → validate** track (below) is an alternative front end that hardens and live-tests real demand before you commit to building.

## Install

Add the marketplace and install the plugin:

```
/plugin marketplace add malikriv/builderkit
/plugin install builderkit@builderkit
```

To pin BuilderKit for a whole team, add it to the project's `.claude/settings.json` instead so every clone picks it up automatically:

```json
{
  "extraKnownMarketplaces": {
    "builderkit": { "source": { "source": "github", "repo": "malikriv/builderkit" } }
  },
  "enabledPlugins": { "builderkit@builderkit": true }
}
```

## Quickstart

1. Run `/builderkit:setup` once per project. It detects your stack, confirms the generated config, and walks the 4 testing phases one at a time — each scaffolded from plugin templates and verified live before moving on.
2. For a new idea (or to plan an existing one), run `/builderkit:evaluate <idea>` for a go/no-go + MVP spec, then `/builderkit:audit` to turn it into a ranked, brand-safe build list. Each build-list item is ready to ship.
3. From then on, run `/builderkit:ship <request>` for delivery work — feature, bug fix, design correction, or user feedback.

## The product chain (discover → validate → ship)

BuilderKit now starts *before* the build. `/builderkit:discover` hardens a raw seed
into a validated hypothesis (symmetric need assessment, an evidence-bound red-team
panel, a cheap human reality probe, Gate D). `/builderkit:validate` (next module)
runs a 48-hour guerrilla GTM sprint and gates on real cold-stranger willingness to
pay before `/builderkit:ship` builds it. A cross-product studio playbook
(`.builderkit/studio/`) accumulates priors so each new product starts smarter.

## Commands

| Command | What it does |
| --- | --- |
| `/builderkit:setup` | Phased onboarding: detect stack, write `.builderkit/config.yaml`, walk the 4 e2e testing phases. |
| `/builderkit:evaluate <idea>` | ThinkTank evaluation: frame → honest market scan → wedge → distribution → exit-safe framing → MVP spec, ending in a build/refine/shelve call. |
| `/builderkit:audit [scope]` | Play Audit: weight strategies → map plays to surfaces → tier P0/P1/P2 → flag brand/exit conflicts → ranked build list. `metric:<name>` runs the Insight Loop. |
| `/builderkit:discover <seed>` | Take a problem/idea/population to a red-team-hardened, reality-probed Hypothesis Brief (Gate D). Feeds `/builderkit:validate`. |
| `/builderkit:ship <request>` | 8-phase delivery pipeline (intake → recon → analysis → requirements → QA plan → implementation → verification → ship) with Linear journaling. |
| `/builderkit:linear-issue <id>` | Take one Linear issue end-to-end: read → implement → verify → deploy → close with proof. |
| `/builderkit:e2e [smoke\|full\|new <R-id>]` | Run or scaffold e2e flows per the 4-phase testing system. |

## Configuration

Written by `/builderkit:setup`, read by every skill at start, and overridden by the project's `CLAUDE.md` where they conflict.

```yaml
# BuilderKit per-project config — written by /builderkit:setup, read by every
# builderkit skill at start. Repo CLAUDE.md overrides this file where they conflict.
config_version: 1

project:
  name: {{PROJECT_NAME}}
  stack: {{STACK}}            # expo | web-pwa | web

commands:
  workdir: {{WORKDIR}}        # dir all commands run from ("." or e.g. apps/mobile)
  typecheck: {{TYPECHECK}}    # e.g. npx tsc --noEmit
  unit: {{UNIT}}              # e.g. npx jest | npx vitest run
  e2e: {{E2E}}                # e.g. npm run e2e | npx playwright test
  e2e_smoke: {{E2E_SMOKE}}    # fast pack, e.g. npm run e2e:smoke | npx playwright test --grep @smoke
  dev: {{DEV}}                # dev server w/ test auth, e.g. npm run start:devlogin | npm run dev
  dev_port: {{DEV_PORT}}    # port commands.dev serves on (web: used by the Playwright webServer block)

testing:
  driver: {{DRIVER}}          # maestro | playwright
  app_id: {{APP_ID}}          # maestro only: iOS bundle id
  boot_sentinel_testid: {{BOOT_SENTINEL_TESTID}}  # testID/data-testid that only renders signed-in — flows + auth setup assert it
  flows_dir: {{FLOWS_DIR}}    # e.g. apps/mobile/.maestro/ | e2e/
  evidence_dir: {{EVIDENCE_DIR}}  # screenshot evidence output (gitignored)
  phases_complete: []         # setup resume state, subset of [1,2,3,4]
  dev_login:
    mode: {{DEV_LOGIN_MODE}}  # env-creds (native dev client) | storage-state (web)
    env_file: {{ENV_FILE}}    # env-creds: gitignored file holding test creds
  seed:
    account: {{SEED_ACCOUNT}} # seeded test account identity (or "local-fixture")
    seed_file: {{SEED_FILE}}  # SQL/script/fixture that resets the test state
  ci:
    workflow: {{CI_WORKFLOW}}        # path, e.g. .github/workflows/e2e.yml
    workflow_name: {{CI_NAME}}       # display name for `gh workflow run`
    runner: {{CI_RUNNER}}            # ubuntu-latest | [self-hosted, macOS, maestro]
    app_paths: {{APP_PATHS}}      # YAML list of app-code globs that trigger PR e2e runs

linear:
  team: {{LINEAR_TEAM}}       # team key, e.g. ACME
  url: {{LINEAR_URL}}         # linear.app/<org>/team/<KEY>

docs:
  specs_dir: {{SPECS_DIR}}    # spec docs home, e.g. docs/specs/
  design_dirs: []             # optional: where design references live

product:                      # read by the product-strategy module (evaluate + play audit)
  positioning: {{POSITIONING}}        # one-line wedge / brand stance (or "")
  exit_strategy: {{EXIT_STRATEGY}}    # stated exit, keeps framing/claims safe (or "none")
  sensitive_category: {{SENSITIVE}}   # true → Play Audit flags manipulative plays harder
  surfaces: []                # optional: known screens/overlays the Play Audit maps onto
  playbook_ref: {{PLAYBOOK_REF}}      # OPTIONAL override only — engine is self-sufficient; leave empty

modules:
  delivery: true
  testing: true
  linear: true
  product: true               # evaluate (ThinkTank) + play audit + insight loop
  discover: true              # seed → hardened hypothesis
  validate: true              # 48h guerrilla validation sprint
# (the discover:, validate:, and studio: sections follow in the generated config — see templates/config.template.yaml)
```

## The 4-phase testing system

- **Phase 1 — Real-auth dev-login.** Tests run against a REAL signed-in session, not a mocked one, so authed flows behave exactly as they do for a user.
- **Phase 2 — Seeded test state + stable selectors.** A deterministic seed resets known state and flows target stable `testID`/`data-testid` selectors instead of brittle text.
- **Phase 3 — Per-requirement flows + screenshot evidence.** Each requirement gets its own flow that produces screenshot evidence for review and ticket attachment.
- **Phase 4 — CI gate.** The packs run in CI and gate the PR when app code changes.

The driver-agnostic core lives in `skills/e2e-testing/`; platform specifics are in `skills/e2e-testing/drivers/maestro.md` (Expo/iOS) and `skills/e2e-testing/drivers/playwright.md` (web).

## The product-strategy front-end

Before delivery, decide *what* to build and in *what order*:

- **Evaluate** (`/builderkit:evaluate <idea>`) — the ThinkTank pipeline: frame the idea and its exit, run an honest market & competitor scan (the case *against* before the case for), name the defensible wedge, pressure-test solo-founder fit and the organic path to the first 100 users, check framing/claims against the exit, and write a structured MVP spec. Ends with a build / refine / shelve call.
- **Audit** (`/builderkit:audit`) — the Play Audit: weight the 12 strategy families for the product, map product-design plays onto its actual surfaces, tier them P0/P1/P2, **flag the plays the brand should decline** (manipulation-adjacent or off-brand plays — mandatory, especially when `product.sensitive_category` is true), and emit a ranked build list wired to metrics via an Insight Loop. Each item is ready for `/builderkit:ship`.

The module is **self-sufficient**: it ships a complete built-in pattern library, the strategy/metric tables, the flagging rules, and the method in `skills/product-strategy/reference/play-engine.md` (general product-design practice, stack-agnostic). A user never has to supply a deck. `product.playbook_ref` is an **optional override** — point it at a deck reference you license and keep *outside* the plugin to additionally consult its specific named plays; leave it empty and the built-in engine runs the full audit on its own. The plugin deliberately ships the method, not any third-party catalog.

## Extending

BuilderKit is modular. A future module is just a new skill directory under `skills/`, a matching command under `commands/`, and its own section in the config. Each project also keeps a `.builderkit/learnings.md` — hard-won lessons captured per project that feed improvements back into this repo. That's the studio improvement loop: projects learn, the kit gets sharper.
