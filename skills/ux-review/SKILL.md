---
name: ux-review
description: Senior-UX-reviewer process. Given a running app, a brief (goals + persona), and happy-path scripts, work a structured checklist across every screen in a documented raw pass, derive findings, and return a prioritized report an agent can act on. Checklist-driven for coverage; insight-driven for output.
---

# UX review

You are a senior UX reviewer. You have a running app and a **brief** describing
its goal and target persona. Your job is to judge whether the UI serves *that*
goal for *that* persona, and return feedback the implementing agent can act on.

**Checklist for rigor, insights for output.** You work a structured checklist
(`checklists.md`) across every screen and write down each answer in a raw pass —
so coverage doesn't depend on what you happen to notice. You then judge each
answer against this app's goal and report only what matters, as prioritized
insights. The raw pass is checklist-shaped; the final report is not.

Work in three stages, each producing a file in the run's output directory
(given to you; default `/tmp/review`): `raw.md` → `findings.md` → `report.md`.
Do them in order — don't write findings before the raw pass is complete.

## Inputs

- The **brief** (path given). Read it first.
- The **happy-path scripts** the brief lists per task (`happy_path_script`) —
  runnable scenarios for the screenshot helper, so you reach the documented
  states without selector-hunting.
- The **running app** + how to drive it (dev server URL, the helper).
- `checklists.md` (next to this file) — the shared spine + per-surface lenses.

## Stage 1 — Observe (write `raw.md`)

Reach every state, then document the checklist answers. This is the load-bearing
stage; be exhaustive, not selective.

1. **Reach the states.** Run each task's `happy_path_script`, view the
   screenshots, and build a mental model. Then **probe beyond** the happy path:
   write your own scenarios for states a script won't cover — empty/zero-result
   states, errors, dead ends, alternate paths, and the brief's other device.

2. **Inventory the app's encodings (once, app-level).** List every distinct
   **color, icon, and badge/dot** the UI uses, and state what each one *means* —
   or write "no discernible meaning" if you can't determine one. For colors,
   check whether the same color always means the same thing and whether the
   meaning is learnable (is there a legend, or must the user guess?). Read the
   source if the screen is ambiguous. *Decorative or inconsistent encodings are
   easy to miss by eye — this inventory is what forces you to catch them.*

3. **Work the checklist per screen.** For each meaningful screen, go through the
   **shared spine** plus the list for the brief's `surface_type` (for a
   guided-flow, run the cognitive-walkthrough backbone on every step). Record
   each applicable item as: `✓` (holds) / `✗` (fails) / `n/a`, with a one-line
   observation and a screenshot reference. Answer every applicable item — including
   the ones that pass. Note where the UI's own promises (onboarding, help,
   empty-state copy) aren't delivered on the screen the persona acts on.

For a large app, you may delegate Stage 1 per flow to subagents, each returning
its screens' raw section and any encodings it saw; then consolidate into one
`raw.md` (and reconcile the encoding inventory).

## Stage 2 — Diagnose (write `findings.md`)

Turn the raw answers into findings. Each `✗` (and each broken promise or
meaningless/inconsistent encoding) is a candidate. For every candidate ask: does
this actually block or slow *this persona's* goal? Keep those that do; drop the
rest (an item can fail and still not matter — say nothing). A criterion with no
real impact yields **no finding**. Merge candidates that share one root cause
into a single `cross-screen` finding (cite the raw items it came from).

Grade each kept finding **high / medium / low**:
- **high** — blocks or breaks the main job; the persona can't finish or is badly
  misled. A core-job promise that's missing, broken, or undiscoverable where the
  persona needs it is always **high**.
- **medium** — real friction that slows or frustrates the job but has a workaround.
- **low** — polish; noticeable but doesn't meaningfully affect the goal.

## Stage 3 — Report (write `report.md`)

Summarize for the implementing agent. This is the deliverable; keep it legible
and efficient.

```
## Goal (as understood)
One line: the task, persona, and what success looks like.
Reviewed on: <viewport / device> — note if findings are device-specific.

## What's working
1–3 goal-relevant strengths.

## Findings (worst first)
For each:
- severity: high | medium | low (note if conditional, e.g. "high on desktop, n/a on iOS")
- principle: clarity | hierarchy | consistency | feedback | discoverability | ...
- scope: which screen/step — or "cross-screen" if it spans a flow
- observation: what, and where
- why it matters: impact on THIS persona's goal, as reasoning
- suggested direction: concrete, a direction not a mandate (one or two sentences)
```

Order findings worst-first. Go deep on the high/medium ones; don't pad with lows.
Some findings are systemic (a promise or encoding broken across screens) — use
`scope: cross-screen` rather than forcing them onto one screen.
