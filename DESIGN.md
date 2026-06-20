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

Backbone is a **cognitive walkthrough**: decompose each task into its happy-path
steps and, at every step, interrogate it against the goal. Two passes (build a
mental model first, then critique), severity-rank the findings, and only ever
report insights tied to the goal — never a flat checklist.

1. **Run and orient.** Start the app, walk each primary task once to build a
   mental model, capturing a screenshot per meaningful state.
2. **Walk each step, ask the core questions.** At every step:
   - Will the persona know this is what to do next? *(right sub-goal)*
   - Is the correct action visible / discoverable?
   - Will they connect that action to the outcome they want? *(label/affordance)*
   - After acting, is it clear progress was made? *(feedback / system status)*
3. **Apply the shared spine** (across all surface types):
   - Does the visual hierarchy put the goal-relevant thing first, at a glance?
   - Does every color / icon / pattern carry one consistent, learnable meaning?
   - Is anything on screen irrelevant to the goal (competing for attention)?
4. **Apply surface-type lenses** (declared in the brief):
   - **guided-flow** → is the single next action unambiguous on every screen?
   - **monitoring** → is everything needed visible at a glance, without drilling?
   - **browse-search** → can the persona find and evaluate the right item fast?
5. **Pull heuristics in only where relevant** — Nielsen's 10 as hypothesis
   generators (status, error prevention, recognition-over-recall, recovery), not
   a pass/fail sweep.
6. **Grade and prioritize.** Grade each finding high / medium / low by its impact
   on the persona's goal (a broken core-job promise is always high), and report
   worst-first.

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
