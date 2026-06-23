# Evals

Test apps and harness for exercising the UX review skill (`skills/ux-review/`).
Everything here is a self-contained static web app plus the briefs and scripts a
reviewer needs — no network, no build.

## Layout

- `apps/<id>/` — synthetic test apps. Each ships `index.html` + `app.js` +
  `style.css`, a `brief.md` (the input contract — goals + persona, see
  `DESIGN.md`), and happy-path `scenarios/*.json`.
- `apps/marketing-dashboard-defects/v1..v5/` — defect-seeded variants of the
  `marketing-dashboard` app, for the detection eval.
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

**3. Run a review.** Point a reviewer (an agent following
`skills/ux-review/SKILL.md`) at a running app, giving it the app's `brief.md`,
its `scenarios/`, and the served URL. The skill drives its three stages and
writes `raw.md` → `findings.md` → `report.md` to an output directory you choose.

## Detection eval (does the review catch known defects?)

Each `marketing-dashboard-defects/vN` has 3 seeded defects (15 total). Review
each variant **blind** — against the *clean* app's `brief.md`, without the ground
truth in context — then score the resulting `report.md` against
`defects/marketing-dashboard-ground-truth.md` (recall by severity, plus any
spurious findings). The variants' `scenarios/*.json` already point at
`/marketing-dashboard-defects/vN/index.html`.
