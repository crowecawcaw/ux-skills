# Evals

Test apps and harness for exercising the UX review skill (`skills/ux-review/`).
Everything here is a self-contained static web app plus the briefs and scripts a
reviewer needs — no network, no build.

## Layout

- `apps/<id>/` — synthetic test apps. Each ships `index.html` + `app.js` +
  `style.css`, a `brief.md` (the input contract — goals + persona, see
  `DESIGN.md`), and happy-path `scenarios/*.json`.
- `apps/marketing-dashboard-defects/v1..v7/` — defect-seeded variants of the
  `marketing-dashboard` app, for the detection eval. v1–v5 seed usability
  defects; v6 (craft: alignment, radii/shadows, type scale) and v7 (register:
  playful copy, decorative palette, novelty font) seed aesthetic defects that
  exercise the style-inventory tool and the tone lens.
- `defects/marketing-dashboard-ground-truth.md` — the scoring key for those
  variants. **Keep this out of the reviewer's context** — it's the answer sheet.
- `scenarios.md` — catalog of the apps and which surface type / persona each one
  stresses.
- `shoot.mjs` — screenshot helper: drives an app from a `scenario.json` and saves
  PNGs.

## Running

**1. Serve the apps** (one shared static server):

```sh
python3 -m http.server 4010 -d evals/apps   # apps at http://localhost:4010/<id>/
```

**2. (Optional) capture screenshots** for a scenario:

```sh
npm i -D playwright-core && npx playwright install chromium   # one-time
node evals/shoot.mjs evals/apps/<id>/scenarios/<name>.json /tmp/shots
```

**2b. (Optional) run the style inventory** (DOM measurements for the aesthetic
pass — same playwright-core setup):

```sh
node skills/ux-review/tools/style-inventory.mjs http://localhost:4010/<id>/index.html
node skills/ux-review/tools/style-inventory.mjs evals/apps/<id>/scenarios/<name>.json  # audit a driven state
```

**3. Run a review.** Point a reviewer (an agent following
`skills/ux-review/SKILL.md`) at a running app, giving it the app's `brief.md`,
its `scenarios/`, and the served URL. The skill drives its three stages and
writes `raw.md` → `findings.md` → `report.md` to an output directory you choose.

## Detection eval (does the review catch known defects?)

Each `marketing-dashboard-defects/vN` has 3 seeded defects (21 total across
v1–v7). Review each variant **blind** — against the *clean* app's `brief.md`,
without the ground truth in context — then score the resulting `report.md`
against `defects/marketing-dashboard-ground-truth.md` (recall by severity, plus
any spurious findings). The variants' `scenarios/*.json` already point at
`/marketing-dashboard-defects/vN/index.html`.

v6 and v7 test the aesthetic side specifically: v6's defects are geometry/craft
(expected to be caught via the style-inventory measurements, not eyeballing),
v7's are register (expected to be caught by judging the screenshots against the
brief's tone constraint). They also test calibration — per the skill, aesthetic
findings should come back capped at **medium** severity, so a v6/v7 report full
of highs is a scoring miss even at full recall.

### Skill mode vs. control mode

The detection eval can run reviewers in two modes, to separate how much of the
score comes from the skill versus the underlying model:

- **skill mode** — the reviewer is told to follow `skills/ux-review/SKILL.md`
  exactly, with its checklists, precedents, examples, and the style-inventory
  tool available.
- **control mode** — the reviewer gets a vague "give me feedback on the
  usability and visuals of this design" ask, the same app access (URL, brief,
  screenshot helper), but no skill files and no style-inventory tool. The
  prompt lives in `evals/control-prompt.md`.

Comparing skill-mode and control-mode scores for the same model isolates the
skill's contribution: if control mode already catches most defects, the skill
isn't adding much; if skill mode catches far more (especially the
measurement-gated v6/v7 defects), that's the skill earning its keep.

## Running the detection eval end-to-end (`run-evals.mjs`)

`evals/run-evals.mjs` orchestrates the whole thing: it invokes the Claude Code
CLI headlessly once per (model, variant, mode), grades each resulting
`report.md` against the ground truth with a `claude -p --model sonnet` call,
and writes a summary matrix. It has no dependencies beyond what's already in
`package.json`.

```sh
# Everything (haiku/sonnet/opus × v1-v7 × skill+control) — this is expensive,
# see --dry-run below to preview it first.
node evals/run-evals.mjs

# Narrower run: one model, two variants, skill mode only, 4-way concurrency.
node evals/run-evals.mjs --models sonnet --variants v1,v6 --skill --concurrency 4

# Preview every command and prompt this would run, without calling `claude`
# or spending any tokens. Also exercises directory creation and writes a
# summary skeleton — safe to run any time.
node evals/run-evals.mjs --dry-run

# Re-render <dir>/summary.md from <dir>/grades/*.json without re-grading.
node evals/run-evals.mjs --summarize-only evals-out/<run-timestamp>
```

Flags: `--models <list>` (default `haiku,sonnet,opus`), `--variants
all|<list>` (default `all`, i.e. v1..v7), `--control` / `--skill` (run just
one mode; default is both), `--concurrency <n>` (default 2), `--out <dir>`
(default `evals-out/<UTC timestamp>`), `--timeout-minutes <n>` (per-job hard
timeout, default 25), `--dry-run`.

Each job's raw log lands at `<out>/<mode>/<model>/<variant>/run.log`
alongside the reviewer's `raw.md`/`findings.md`/`report.md`. Grading output
lands at `<out>/grades/<mode>-<model>.json`, and the final matrix at
`<out>/summary.md`. A job that errors or times out is recorded (in
`<out>/jobs.json` and the log) rather than failing the whole run.

The runner checks whether the static server is already serving
`http://localhost:4010/marketing-dashboard/index.html` and starts
`python3 -m http.server 4010 -d evals/apps` itself if not.

## Running in CI

`.github/workflows/ux-eval.yml` runs this eval on demand via
`workflow_dispatch` — it's not on a schedule and doesn't run on push/PR,
since a full run calls a real LLM many times.

**Inputs** (all optional, shown with their defaults):

| input | default | meaning |
|---|---|---|
| `models` | `haiku,sonnet,opus` | comma-separated model aliases |
| `variants` | `all` | comma-separated `v1..v7`, or `all` |
| `control` | `true` | run control mode |
| `skill` | `true` | run skill mode |

**Auth**: the workflow authenticates the Claude Code CLI with a Claude
subscription (not an API key), via a long-lived OAuth token. Generate one
locally with `claude setup-token` (requires an active subscription) and add
it as a repository secret named `CLAUDE_CODE_OAUTH_TOKEN` (repo Settings ->
Secrets and variables -> Actions -> New repository secret). The workflow
passes it through as the `CLAUDE_CODE_OAUTH_TOKEN` env var.

**Where results land**: the whole `evals-out/` output directory is uploaded
as a build artifact (`ux-eval-results`) on every run, including failed ones
(`if: always()`). The summary matrix (`summary.md`) is also appended to the
job's `$GITHUB_STEP_SUMMARY`, so it's visible directly on the workflow run
page without downloading the artifact.

Run time scales with `models` × `variants` × modes — the job has a 180-minute
timeout; narrow `models`/`variants` for a quick check.
