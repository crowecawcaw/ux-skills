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

**Usability, not aesthetics.** Judge whether the persona can understand and
accomplish their goal — clarity, hierarchy, flow, feedback. Visual taste ("looks
dated", "use a softer palette") is out of scope; flag a visual issue only when it
impairs comprehension or the task (e.g. an active state indistinguishable from
inactive), never for beauty alone.

Work in three stages, each producing a file in the run's output directory
(given to you; default `/tmp/review`): `raw.md` → `findings.md` → `report.md`.
Do them in order — don't write findings before the raw pass is complete.

**Run each stage in its own subagent for clean context.** The on-disk files are
the hand-off: spawn a subagent for Stage 1 (give it the output dir, brief, and
helper; it writes `raw.md`), then a *fresh* subagent for Stage 2 (it reads
`raw.md` + the brief, writes `findings.md`), then another for Stage 3 (it reads
`findings.md`, writes `report.md`). Each starts focused on just its input file,
so the screenshot-exploration noise from Stage 1 doesn't crowd the diagnosis, and
diagnosis doesn't crowd the report.

**Within Stage 1, fan out by *kind of check* — keep the high-level goal review
separate from the low-level mechanical checks.** Capture the screenshots once
(run the happy-path scripts + your probes into a shared folder), then spawn:
- a **goal-review** subagent — walks each task to completion and verifies the
  app's promises (Stage 1 step 2). This is the headline judgment; it must not
  share context with color-counting.
- an **encoding-inventory** subagent — catalogs every color/icon/badge and its
  meaning (step 3).
- one or more **checklist** subagents — work the per-screen items (step 4); for
  a large app, split these further per flow.

Give each the shared screenshot folder (and source access) so they don't re-drive
the app. The Stage 1 orchestrator consolidates their returns into one `raw.md`
with the goal review at the top, reconciling the encoding inventory across
agents. (For a quick review of a small app you may run everything inline.)

## Inputs

- The **brief** (path given). Read it first.
- The **happy-path scripts** the brief lists per task (`happy_path_script`) —
  runnable scenarios for the screenshot helper, so you reach the documented
  states without selector-hunting.
- The **running app** + how to drive it (dev server URL, the helper).
- `checklists.md` (next to this file) — the shared spine + per-surface lenses.

## Stage 1 — Observe (write `raw.md`)

Reach every state, then document. Do the parts in order: **task completion
first** (it protects the headline judgment), then encodings, then the per-screen
checklist (coverage). Don't let the checklist crowd out whether the main job
actually works.

1. **Reach the states.** Run each task's `happy_path_script`, view the
   screenshots, and build a mental model. Then **probe beyond** the happy path:
   write your own scenarios for states a script won't cover — empty/zero-result
   states, errors, dead ends, alternate paths, and the brief's other device.

2. **Walk each task to completion — the most important check.** For each
   `primary_task`, walk it end-to-end and record: **can the persona actually
   reach its `success_criterion`?** If not, name exactly where it breaks. Then
   **verify the app's promises**: every claim the UI makes (onboarding, help,
   empty-state copy, a button label) must be delivered on the screen where the
   persona acts — a promise made but not delivered is a break. Do **not** assume
   a task is served because a similar-looking control exists; confirm it does the
   job the brief defines (e.g. subscribing to the *aggregate feed* the brief
   names, not a single item that merely looks similar). A task that can't reach
   its success_criterion is the headline finding — never let it dissolve into the
   per-screen items below.

3. **Inventory the app's encodings (once, app-level).** List every distinct
   **color, icon, and badge/dot** the UI uses, and state what each one *means* —
   or write "no discernible meaning" if you can't determine one. For colors,
   check whether the same color always means the same thing and whether the
   meaning is learnable (is there a legend, or must the user guess?). Read the
   source if the screen is ambiguous. *Decorative or inconsistent encodings are
   easy to miss by eye — this inventory is what forces you to catch them.*

4. **Work the checklist per screen.** For each meaningful screen, go through the
   **shared spine** plus the list for the brief's `surface_type` (for a
   guided-flow, run the cognitive-walkthrough backbone on every step). Record
   each applicable item as: `✓` (holds) / `✗` (fails) / `n/a`, with a one-line
   observation and a screenshot reference. Answer every applicable item — including
   the ones that pass.

When you split Stage 1 across subagents (see the fan-out note above), the
goal-review check (step 2) goes to its own agent and lands at the top of
`raw.md` — never folded in with the per-screen checklist returns, which is where
the headline tends to get lost.

## Stage 2 — Diagnose (write `findings.md`)

Turn the raw answers into findings. **Start with the task-completion check
(Stage 1 step 2):** any `primary_task` that can't reach its `success_criterion`,
and any core-job promise that's missing, broken, or undiscoverable where the
persona needs it, is a finding and almost always the headline — write these
first, before the per-screen items, and don't let them get downgraded into a
copy nitpick. Then the per-screen `✗`s and meaningless/inconsistent encodings are
further candidates. For every candidate ask: does this actually block or slow
*this persona's* goal? Keep those that do; drop the rest (an item can fail and
still not matter — say nothing). A criterion with no real impact yields **no
finding**. Merge candidates that share one root cause into a single
`cross-screen` finding (cite the raw items it came from).

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

Don't credit a strength the raw pass contradicts: if a task didn't complete,
the main job is not "working"; if the encoding inventory found a gap, the colors
aren't "consistent and learnable". **What's working** is for things the raw pass
actually confirmed.
