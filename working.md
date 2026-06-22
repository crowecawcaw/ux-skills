# working.md — project state & handoff

Working notes for the **ux-skills** UX review tool. Snapshot before a context
clear. Everything below is committed on `main`.

## What this project is

A UX feedback mechanism for agents: give it a running app + a **brief** (goals +
target persona) and it returns prioritized, goal-anchored UX feedback an agent
can iterate against. Measured with agent evals, not human ratings.

Tenets (`README.md`):
1. **Checklists for rigor, insights for output** — work a structured checklist on
   every screen (documented raw pass), but report prioritized insights, not a
   generic scorecard.
2. **Usability, not aesthetics** — judge comprehension/task success; visual taste
   is out of scope.
3. **For agents primarily, humans second** — feedback legible/efficient for agent
   iteration; success measured by agent evals.

## The review system — `skills/ux-review/`

- **`SKILL.md`** — the process. Three stages, each writing a file:
  `raw.md` (Observe) → `findings.md` (Diagnose) → `report.md` (Report).
  - Stage 1 order matters: **task-completion + promise-verification FIRST**
    (the headline judgment), then the **encoding inventory** (every color/icon/
    badge → meaning, catches decorative/inconsistent encodings), then the
    **per-screen checklist**.
  - Run each stage in its **own subagent** for clean context; within Stage 1, fan
    out by check category (goal-review vs encoding-inventory vs checklist) so the
    high-level judgment never shares context with low-level color-counting.
  - Severity is **high / medium / low** (a missing/broken/undiscoverable core-job
    promise is always high). Merge same-root-cause findings (`scope: cross-screen`).
- **`checklists.md`** — shared visual/interaction **spine** + per-surface lenses
  (`guided-flow`, `browse-search`, `monitoring`), adapted from NN/g, Baymard,
  GOV.UK, Stephen Few, Nielsen.
- **`examples.md`** — worked format snippets of each stage file, using a fictional
  placeholder app (Expensr) so it anchors shape, not findings.

**Brief format**: YAML — `app`, `primary_device`, `persona` (goals/context/
expertise_level/pain_points), `core_job` (JTBD when/i_want_to/so_i_can +
success_functional + success_emotional), `surface_type`, `primary_tasks` (each
with `happy_path`, `happy_path_script`, `success_criterion`), `scope` (in/out),
`known_gaps`, `constraints`. Reference: `evals/832events-brief.md`,
`evals/apps/*/brief.md`.

## Tooling

- **`evals/shoot.mjs`** — screenshot/drive helper. Scenario JSON:
  `{ baseUrl, outDir, viewport?, steps: [...] }`; step types: `goto`, `click`,
  `fill [sel,val]`, `selectOption [sel,val]`, `press`, `wait`, `shot` (+`fullPage`),
  `shotEl [name,sel]`. Run: `node evals/shoot.mjs <scenario.json> [outDirOverride]`.
  Imports playwright-core from `evals/832events/web/node_modules` (so that
  submodule must have had `npm install`). Fails fast (8s) on bad selectors.
- **Shared static server for synthetic apps** (EPHEMERAL — restart each session):
  `python3 -m http.server 4010 -d evals/apps` → apps at `http://localhost:4010/<id>/index.html`.
- **832events** (real first app, git submodule): `git submodule update --init
  evals/832events`, then `cd evals/832events && npm install && npm run
  generate-calendars` (offline, builds ~7900 events from committed fetch-cache)
  `&& npm run web:dev` → http://localhost:5173. See `evals/832events.md`.

## Evals we have

### App 0 — 832events (real)
Brief `evals/832events-brief.md`, scenarios `evals/832events-scenarios/`, sample
reports `evals/reports/` (incl. `832events-latest/` = formal staged run). Headline
finding the tool repeatedly catches: the "subscribe once" combined-feed promise
has no UI on the Following screen (severity high, cross-screen).

### Synthetic apps — `evals/scenarios.md` (10 documented, 3 built)
`evals/apps/`: **marketing-dashboard** (monitoring), **checkout** (guided-flow),
**catalog** (browse-search). Each self-contained static (no build/network) +
`brief.md` + `scenarios/`. Backlog of 7 more in `scenarios.md` (account-wizard,
booking, docs-search, incident-dashboard, data-table, settings-console,
chat-assistant — chat is deliberately outside the 3 lenses).

### Eval 1 — Detection (`evals/runs/detection/`)
5 defective marketing-dashboard variants (`evals/apps/marketing-dashboard-defects/
v1..v5`, 15 seeded defects), ground truth `evals/defects/marketing-dashboard-
ground-truth.md` (kept out of app dirs). 5 blind reviews + `scorecard.md`.

### Eval 2 — Review→address loop (`evals/runs/loop/`)
3 clean apps × 3 iterations of independent review→fix; per-iteration `report.md`,
`app-snapshot/`, `shots/`; analysis in `loop/SUMMARY.md`. Index tying both evals:
`evals/runs/README.md`.

## How to run the evals

```sh
# 0. one-time: ensure the 832events submodule has node_modules (for playwright)
git submodule update --init evals/832events && (cd evals/832events && npm install)

# 1. start the shared static server (serves the synthetic apps)
python3 -m http.server 4010 -d evals/apps   # background it

# 2a. a single review of an app (follow skills/ux-review/SKILL.md):
#     point a reviewer agent at the app URL + its brief.md + scenarios/, have it
#     write raw.md/findings.md/report.md and screenshot via shoot.mjs.

# 2b. detection eval: review each marketing-dashboard-defects/vN at
#     http://localhost:4010/marketing-dashboard-defects/vN/index.html using
#     evals/apps/marketing-dashboard/brief.md, then score vs the ground truth.

# 2c. loop eval: cp an app to evals/apps/<app>-loop, rewrite scenario goto paths
#     to /<app>-loop/, then alternate review-subagent -> fix-subagent x3,
#     snapshotting code each iteration.
```

## What we found

- **Detection: recall 8/15 (53%), high-severity 5/8 (63%), 0 spurious, ~8 real
  *unseeded* bugs caught.** Reliable on structural/textual defects (missing
  freshness, missing legend, broken color bars, missing context). **Blind spot:
  chart-perception** — all 3 missed highs were hero-metric inversion, truncated
  y-axis, and indistinguishable trend lines (judged from rendered pixels).
- **Loop progression (H/M/L):** marketing 0/2/1→0/1/2; checkout 1/2/2→1/1/2;
  catalog 0/2/2→0/1/2. Mediums trend down where fixes are real. **checkout's HIGH
  persists** — a hard multi-step edit-state bug; each fix closed the reported
  facet but the reviewer reliably re-caught a remaining data-loss path (one fix
  introduced a regression that was then re-caught). Independent re-review catching
  regressions is a feature for an iterating agent.
- The synthetic clean baselines had real latent bugs the review caught (e.g. the
  marketing-dashboard delta-arrow-vs-sign contradiction was flagged by nearly
  every reviewer).

## Orchestration lessons (important)

- **Do NOT build nested self-driving loop subagents.** A subagent that spawns
  children with `run_in_background` and yields does **not** resume reliably — all
  three loop orchestrators stalled after iteration 1. Drive multi-step loops from
  the **top level**: single-purpose review/fix subagents you await, with **Bash**
  for setup/snapshot/commit. (If you must delegate a whole loop to one subagent,
  tell it to run children **synchronously** and not yield — even then it was
  unreliable here.)
- Orphaned children kept writing after their orchestrators died; isolate a
  controlled run in a **separate path** (we used `evals/runs/looprun/`, then
  swapped into `evals/runs/loop/`).
- **Background subagents writing into the working tree trip the stop-hook**
  (untracked files every turn). Mitigations used: commit completed units as they
  land; **gitignore volatile dirs** during a run (`evals/apps/*-loop/` is ignored;
  `evals/runs/loop` + `looprun` were temporarily ignored, then finalized).
- `-loop` working copies are scratch (gitignored); the real per-iteration code is
  in `evals/runs/loop/<app>/iterN/app-snapshot/`.

## Suggested next steps

1. **Close the detection blind spot:** add chart-perception items to the
   monitoring checklist — "is the y-axis baseline honest (not truncated to
   exaggerate)?", "are chart series visually distinguishable?", "is the most
   decision-critical metric the most prominent (no hero inversion)?". Then re-run
   the detection eval to measure the recall lift (expect the 3 missed highs to
   flip).
2. **Make stage files always land on disk** — some loop reviewers returned
   findings/report as text instead of writing `findings.md`/`report.md`. Tighten
   the SKILL/prompt to require writing each file.
3. **Better loop metric:** track a per-app **defect ledger** (introduced/fixed/
   regressed) instead of independent per-iteration counts, so progression is a
   clean number; optionally let the re-review reference the prior report to
   explicitly verify each fix.
4. **Breadth:** build the remaining scenario apps (esp. `chat-assistant` #10 —
   tests reasoning when `surface_type` is outside the 3 lenses).
5. **Headline eval metric** for the tenets: seeded-defect recall + false-positive
   rate as the agent-facing score; run it whenever the SKILL/checklists change.
6. **832events close-the-loop:** run review→fix→review on the real app too.

## State / gotchas for next session

- The **static server on :4010 is not running** in a fresh container — restart it.
- 832events submodule needs `npm install` (+ `generate-calendars` for data) before
  shoot.mjs or a 832 review will work.
- `evals/reports/`, `evals/runs/` are **disposable** artifacts (the loop/detection
  bundles can be `git rm -r`'d). Library code is `skills/ux-review/` + the tooling.
- Default reviewer model used in evals: **Sonnet**. Weaker-model (Haiku) runs were
  used earlier to prove the guidance carries a smaller model.
