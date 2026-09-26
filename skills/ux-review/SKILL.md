---
name: ux-review
description: Review a running web app against a product brief and return prioritized, evidence-backed UX findings. Use for task-flow, usability, interface-craft, or pre-release reviews.
---

# UX review

Review whether the app serves the brief's target user and goals. Cover every
relevant screen and state, but report only findings that affect the user's work.

Use measurements, observed behavior, and established interface conventions in
preference to opinion. Do not report unanchored taste. A craft finding must cite
the style inventory; a tone finding must cite the brief's stated tone. Cap
aesthetic findings at medium unless they impair legibility or comprehension.

## Process

Work in three stages and write each result to the requested output directory
(default `/tmp/review`):

1. Observe → `raw.md`
2. Diagnose → `findings.md`
3. Report → `report.md`

Run each stage in its own fresh subagent. Files are the handoff: Stage 2 reads
`raw.md` and the brief; Stage 3 reads `findings.md` and the brief. Do not begin
a stage before its input is complete.

The Stage 1 subagent must capture screenshots once, then fan out by check type:

- **Goal review:** complete every task and verify every UI promise (step 2).
- **Encoding inventory:** catalog every color, icon, badge, and dot (step 3).
- **Checklist review:** apply every relevant check to every meaningful screen;
  split further by flow for large apps (step 4).
- **Style and tone:** run the style inventory, confirm its flags in screenshots,
  and apply the craft and tone checks (step 5).
- **Fresh-eyes probes:** use a separate context-free subagent for each probe
  (step 6).

Give all agents except fresh-eyes probes the shared screenshots and source
access. The Stage 1 subagent consolidates their results into `raw.md`, with task
completion first, and reconciles overlapping or conflicting observations.
Fresh-eyes subagents receive only their assigned screenshot and question.

## Inputs

- Brief: product goal, persona, core job, `surface_type`, primary tasks and
  success criteria, scope, target devices, and tone.
- A running app and instructions for operating it.
- Each task's `happy_path_script`.
- Optional prior `report.md` for an iteration review.
- [checklists.md](checklists.md): shared, surface-specific, and craft checks.
- [precedents.md](precedents.md): conventions selected by `surface_type`.
- [tools/style-inventory.mjs](tools/style-inventory.mjs): DOM measurements;
  requires `playwright-core`.
- [examples.md](examples.md): output examples. Follow their structure, not
  their fictional findings.

## Stage 1: Observe

Write `raw.md`.

1. **Reach every state.** Run every `happy_path_script`, inspect its
   screenshots, then create scenarios for relevant empty, zero-result, error,
   dead-end, alternate-path, and target-device states.

2. **Complete every primary task.** Walk each task end to end and record whether
   the persona reaches its `success_criterion`. Name the exact break when it
   fails. Verify every promise the UI makes on the screen where the user acts;
   do not treat a similar-looking control as proof that the promised job works.
   Put this task-completion section first in `raw.md`.

3. **Inventory every encoding.** List every distinct color, icon, badge, and
   dot, and record its meaning or `no discernible meaning`. Check that meanings
   are consistent and learnable. Inspect source when the screen is ambiguous.

4. **Run the checklist on every meaningful screen.** Apply the shared spine and
   the brief's `surface_type` section from `checklists.md`. For guided flows,
   apply the cognitive-walkthrough items to every step. Record every applicable
   item as `✓`, `✗`, or `n/a`, with a one-line observation and screenshot
   reference, including passing items.

5. **Measure every key screen state.** Run `tools/style-inventory.mjs` against
   each key URL or scenario. Confirm each reported issue in its screenshot
   before recording it. Apply the aesthetics and craft section of
   `checklists.md`; cite the measurement or tone constraint for every failure.
   Never estimate geometry by eye.

6. **Run fresh-eyes probes.** Give each probe subagent only the named screenshot:
   no brief, app name, task context, prior impressions, or shared probe context.
   Run probes in parallel and record answers verbatim beside the expected answer.

   - Five-second test on the first screen: “You looked at this screen for five
     seconds. What is this app for? What's the main thing you can do here? What
     drew your eye first?” Compare with `one_line_purpose` and the intended
     primary action.
   - First-click test for every `primary_task`: provide the starting screenshot
     and describe the desired outcome without quoting a UI label. Ask: “Where
     would you click first? Describe the element.” Compare with the happy path's
     first step.

   If the outcome cannot be stated without the UI's label, note that. Treat a
   wrong or hesitant answer as discoverability evidence and a correct answer as
   evidence for a strength.

7. **Re-verify every prior finding** when a prior report is provided. Reach the
   same state and mark it `fixed`, `unchanged`, or `regressed`, with a screenshot
   reference. Record regressions caused by a fix.

## Stage 2: Diagnose

Read `raw.md`, the brief, and the brief's `surface_type` section in
`precedents.md`. Write `findings.md`.

Start with failed tasks and broken core-job promises. A primary task that cannot
reach its success criterion, or a core-job promise that is missing, broken, or
undiscoverable where needed, is normally the headline finding.

Then consider every failed checklist item, meaningless or inconsistent
encoding, confirmed style issue, failed probe, and relevant precedent break.
Keep a candidate only when it blocks, misleads, or slows this persona. Merge
items with one root cause into a cross-screen finding. Respect `scope.out`.

Confirmed craft and tone issues are the exception to the direct task-impact
test: keep them when they violate a measured craft check or the brief's stated
tone, even if every task still completes. Grade them low or medium unless they
impair legibility or comprehension.

For each kept finding:

- cite the observation and screen or step;
- explain the effect on this persona's goal;
- cite a relevant convention or verbatim probe answer when available;
- suggest a concrete direction, not a mandated design;
- grade severity:
  - `high`: blocks the main job or badly misleads the user;
  - `medium`: meaningful friction with a workaround;
  - `low`: noticeable polish that does not materially affect the goal.

A single anomalous probe answer on an otherwise clear screen is not enough for
a finding. Carry prior findings forward as fixed, unchanged, or regressed rather
than re-deriving them.

## Stage 3: Report

Read `findings.md` and write `report.md` for the implementing agent. Use the
structure in `examples.md`:

1. Goal as understood, including persona, success, and reviewed device.
2. Since last review, when applicable: fixed, unchanged, regressed, and new
   regressions caused by fixes.
3. What's working: one to three strengths supported by `raw.md`.
4. Top three changes: root-cause changes that resolve the most important
   findings; name the findings each change addresses.
5. Findings, worst first. Include severity, principle, scope, observation,
   impact on the persona's goal, and suggested direction.

Include supported low-severity findings after the high and medium findings, but
do not invent filler. Do not claim a strength contradicted by the raw pass. Use
`cross-screen` scope for systemic findings.

## Thorough mode

When the caller requests a thorough or pre-release review:

1. Capture screenshots, measurements, and fresh-eyes probes once.
2. Run three independent Stage 1 and Stage 2 passes as separate subagents,
   producing `raw-N.md` and `findings-N.md` without access to one another.
3. Merge findings reported by at least two reviewers. Re-verify the evidence
   for any singleton before keeping it. Deduplicate by root cause and use the
   majority severity, or the higher severity for a one-to-one split.
4. Write the merged `findings.md`, then run Stage 3 once.

Default to one pass unless thorough mode is requested.
