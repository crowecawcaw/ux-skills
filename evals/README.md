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
