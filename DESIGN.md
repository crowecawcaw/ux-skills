# UX review tool — design (v0)

A starting point, grounded in established UX methods, meant to be iterated. See
`README.md` for the goals and tenets.

## Architecture

```
implementation agent
   │  brief (goals + persona) + how-to-run the app
   ▼
review agent  ──follows──►  UX review skill (guided process)
   │   runs the app → captures screenshots → walks the brief's tasks
   │   → critiques each step against the goal → scores severity
   ▼
structured feedback  ──────►  implementation agent iterates
```

The reviewer is invoked by the implementation agent, runs the real app, and
returns feedback the agent can act on directly. We measure quality with agent
evals — does feedback make the next iteration's UI measurably better — not human
ratings.

## Two things to fill in

The whole tool hinges on two artifacts: the **brief** (the input contract) and
the **review process** (the reviewer's method). Both below are v0 drafts adapted
from established practice, not invented from scratch.

## The brief (input contract)

The brief is what makes feedback goal-specific instead of generic. It carries
enough context that the reviewer can reason about whether the UI serves *this*
app's goal. Adapted from design-brief, jobs-to-be-done, and usability-task
formats — keeping only fields that change a design judgment.

```yaml
app:
  name:
  one_line_purpose:          # what it is, in a sentence
  how_to_run:                # start commands + entry URL

persona:                     # evaluation-relevant fields only
  goals:                     # what they want to accomplish, and why
  context:                   # when/where/on what they use it
  expertise_level:           # novice → expert; sets the bar for jargon & density
  pain_points:               # what blocks the goal today

core_job:                    # JTBD job story — a feature-neutral target
  when:                      # trigger / situation
  i_want_to:                 # motivation
  so_i_can:                  # outcome
  success_functional:        # task objectively done
  success_emotional:         # felt confident / in control / unblocked

surface_type:                # the branch selector for the review process —
                             # e.g. guided-flow | monitoring | browse-search

primary_tasks:               # 1–8 flows the reviewer walks
  - title:
    goal:                    # outcome, stated with an action verb
    happy_path: []           # ordered UI steps
    success_criterion:       # what "done" looks like

scope:
  in: []
  out: []                    # so the reviewer doesn't flag deliberate non-goals

constraints:                 # platform, accessibility, technical — plus:
  tone: []                   # 3–5 brand adjectives (e.g. professional, calm,
                             # trustworthy) the rendered UI is judged against.
                             # No stated tone → no register findings; this is
                             # what keeps aesthetic feedback anchored.
```

A review can also take a **prior report** (the previous round's `report.md`) as
a separate optional input: the reviewer then re-verifies each prior finding
(fixed / unchanged / regressed) instead of re-deriving it, and the new report
leads with a "Since last review" delta — so an iterating agent sees what landed,
not a re-litigation.

The load-bearing pieces: the **job story** (an evaluable, feature-neutral goal),
**persona expertise + pain points** (sets the acceptability bar), **per-task
success criteria** (concrete anchors), **`scope.out`** (stops false flags on
things the app deliberately doesn't do), and **`constraints.tone`** (the only
license for register findings).

## The review process (reviewer's method)

Three stages, each producing a file, so coverage is documented rather than left
to what the model happens to notice. The checklist drives the raw pass; only the
final report is prioritized insight. (Item lists live in `skills/ux-review/
checklists.md`; the cognitive walkthrough is the guided-flow backbone.)

1. **Observe → `raw.md`.** Reach every state (run the brief's happy-path scripts,
   then probe empty/error/alternate states). Inventory every color, icon, and
   badge and what each *means* (or "no discernible meaning"). Work the
   checklist — the shared spine + the surface-type lens — on every screen,
   recording each item `✓ / ✗ / n/a` with a one-line observation and screenshot
   ref; answer the passing items too. Then two evidence passes that don't rely
   on the reviewer's judgment:
   - **Style inventory** — `tools/style-inventory.mjs` extracts DOM facts
     (type/color/spacing census, alignment near-misses, WCAG contrast,
     overflow); VLMs are unreliable at eyeballing geometry, so aesthetic
     observation is measured, never estimated. The reviewer confirms each flag
     in the screenshot and works the aesthetics & craft list (including
     register vs `constraints.tone`).
   - **Fresh-eyes probes** — simulated 5-second and first-click tests: a
     context-free subagent sees one screenshot (no brief, no context) and
     answers "what is this app / where would you click to <outcome>?".
     Discoverability becomes an observed result instead of an opinion.
   With a prior report, also re-verify each prior finding (fixed / unchanged /
   regressed). Large apps fan Stage 1 out to subagents per kind of check.
2. **Diagnose → `findings.md`.** Each `✗` (plus each broken promise,
   meaningless/inconsistent encoding, confirmed style flag, and failed probe)
   is a candidate; keep only those that block or slow *this persona's* goal — a
   failed item with no real impact yields no finding. Frame findings against
   the genre conventions in `precedents.md` (expectation breaks read stronger
   than bare heuristics) and sweep that list for misses. Aesthetic candidates
   need a measurement or a stated tone constraint, and cap at medium. Merge
   shared-root-cause candidates. Grade high / medium / low (a broken core-job
   promise is always high).
3. **Report → `report.md`.** The deliverable, worst-first, led by a **Top 3
   changes** synthesis (the root-cause decisions that clear the most findings)
   and — on iteration reviews — a **Since last review** delta.

For high-stakes reviews there's a **thorough mode**: screenshots and the style
inventory are captured once (facts don't need independence), but Stages 1–2 run
as three independent reviewer passes whose findings are consolidated (keep what
≥2 report; re-verify singletons) before Stage 3 — the NN/g multiple-evaluator
effect, bought only when it's worth ~3× the cost.

### Feedback format

Every review returns, anchored to screenshots:

- **Goal restatement** — the task, persona, and success criteria as understood.
- **Since last review** (iterations only) — fixed / unchanged / regressed.
- **What's working** — 1–3 goal-relevant strengths (honest baseline).
- **Top 3 changes** — the synthesis: if the implementing agent does only three
  things, which root-cause changes clear the most findings.
- **Prioritized findings** — grouped by severity, each as:
  - `severity` (high / medium / low)
  - `principle` (clarity / hierarchy / consistency / feedback / craft / tone / …)
  - `observation` (what, and where — link the screenshot/step; craft/tone
    findings carry their measurement or the brief's tone words)
  - `why_it_matters` (impact on *this* persona's goal, as reasoning — citing
    the genre convention or the probe's verbatim answer where one applies)
  - `suggested_direction` (concrete, framed as a direction, not a mandate)

Go deep on the few things that matter for the goal; never emit a flat,
undifferentiated list.

## What we pulled from

Adapted, not copied — these are the starting points, to be refined with evals:

- Cognitive walkthrough (the step-by-step backbone) — NN/g.
- Heuristic evaluation method + severity ratings (we use a coarser high/medium/
  low — LLMs grade loose categories more reliably than a 0–4 scale) — Nielsen / NN/g.
- PURE — per-step, persona-anchored difficulty scoring — NN/g.
- Jobs-to-be-done / job stories — for a feature-neutral goal.
- Design-critique discipline (insight not taste, goal-anchored, prioritized) —
  NN/g, Figma.
- Cross-system design principles (clarity, hierarchy, consistency, feedback) —
  GOV.UK, Apple HIG, Material, IBM Carbon, Shopify Polaris.
- Five-second tests and first-click tests (simulated with context-free
  subagents instead of human panels) — classic usability-testing practice,
  NN/g / UsabilityHub-era tooling.
- Genre convention research for the precedent library — Baymard Institute,
  NN/g, Stephen Few, GOV.UK patterns, plus conventions normalized by the
  dominant products in each genre.
- Craft measurement standards — WCAG contrast math, type-scale practice,
  4/8-pt spacing systems; extracted from the DOM (Playwright) rather than
  judged from pixels.

## Open questions

- The exact `surface_type` taxonomy — start with the three above and grow it
  (precedents.md grows with it).
- The eval harness itself: what makes a "better UI" measurable for agents.
- Style-inventory threshold tuning: the flags are calibrated on the synthetic
  apps; real-world apps will need the conservative/noisy balance re-checked.
- Probe reliability: one probe per question for now — when is a 3-probe vote
  worth the cost, and does probe-model choice change answers?
- Severity calibration for craft/tone findings across many reviews (does the
  medium cap hold up, or do measured-but-trivial flags still leak through?).
