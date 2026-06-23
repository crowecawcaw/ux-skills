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

constraints:                 # tone, platform, accessibility, technical
```

The load-bearing pieces: the **job story** (an evaluable, feature-neutral goal),
**persona expertise + pain points** (sets the acceptability bar), **per-task
success criteria** (concrete anchors), and **`scope.out`** (stops false flags on
things the app deliberately doesn't do).

## The review process (reviewer's method)

Three stages, each producing a file, so coverage is documented rather than left
to what the model happens to notice. The checklist drives the raw pass; only the
final report is prioritized insight. (Item lists live in `skills/ux-review/
checklists.md`; the cognitive walkthrough is the guided-flow backbone.)

1. **Observe → `raw.md`.** Reach every state (run the brief's happy-path scripts,
   then probe empty/error/alternate states). Inventory every color, icon, and
   badge and what each *means* (or "no discernible meaning"). Then work the
   checklist — the shared spine + the surface-type lens — on every screen,
   recording each item `✓ / ✗ / n/a` with a one-line observation and screenshot
   ref. Answer the passing items too. Large apps can fan Stage 1 out to subagents
   per flow.
2. **Diagnose → `findings.md`.** Each `✗` (and each broken promise or
   meaningless/inconsistent encoding) is a candidate; keep only those that block
   or slow *this persona's* goal — a failed item with no real impact yields no
   finding. Merge shared-root-cause candidates. Grade high / medium / low (a
   broken core-job promise is always high).
3. **Report → `report.md`.** The deliverable, worst-first.

### Feedback format

Every review returns, anchored to screenshots:

- **Goal restatement** — the task, persona, and success criteria as understood.
- **What's working** — 1–3 goal-relevant strengths (honest baseline).
- **Prioritized findings** — grouped by severity, each as:
  - `severity` (high / medium / low)
  - `principle` (clarity / hierarchy / consistency / feedback / …)
  - `observation` (what, and where — link the screenshot/step)
  - `why_it_matters` (impact on *this* persona's goal, as reasoning)
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

## Open questions

- How many independent review passes to consolidate (the 3–5-reviewer
  reliability effect) vs. cost?
- The exact `surface_type` taxonomy — start with the three above and grow it.
- How feedback threads across iterations (does the reviewer see prior rounds?).
- The eval harness itself: what makes a "better UI" measurable for agents.
