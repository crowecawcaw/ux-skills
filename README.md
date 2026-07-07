# ux-skills

A UX feedback mechanism for agents that helps them refine UI designs.

We're building a UX review tool that agents can iterate against. It takes an app
(web apps to start) along with a brief describing the goals and target persona,
and produces actionable feedback.

## Tenets

- **Checklists for rigor, insights for output.** The reviewer works through a
  structured checklist on every screen — documenting each answer in a raw pass so
  coverage doesn't depend on what the model happens to notice — but it judges
  each item against *this* app's specific goal and persona. The deliverable is a
  prioritized set of insights a senior UX reviewer would give, not a generic
  pass/fail scorecard of universal rules.

- **Usability first; no unmeasured taste.** The headline judgment is always
  whether the persona can understand and accomplish their goal — clarity,
  hierarchy, flow, feedback. Aesthetic feedback is in scope, but only with
  evidence: craft findings (misalignment, type sprawl, tiny text, contrast) must
  cite DOM measurements from the style-inventory tool — models can't reliably
  eyeball geometry — and register findings ("too playful for a professional
  site") must cite tone constraints the brief actually states. Free-floating
  taste remains out of scope, and aesthetic findings cap at medium severity
  unless they break legibility.

- **Evidence over judgment.** Prefer an observation you can point at to an
  opinion: DOM measurements for geometry, context-free fresh-eyes probes
  (simulated 5-second and first-click tests) for discoverability, genre
  precedents for expectation breaks, and multiple independent reviewers when
  thoroughness is worth the cost.

- **For agents primarily, humans second.** We want to unlock agents to produce
  better UI designs through quality feedback. Feedback should be legible,
  efficient, and effective for agent iteration. Success is measured with agent
  evals, not human feedback. It will likely be useful for people too, but that's
  incidental.

## Layout

- `skills/ux-review/` — the review skill: `SKILL.md` (the staged process),
  `checklists.md` (shared spine + per-surface lenses + measured aesthetics),
  `precedents.md` (genre conventions per surface type), `examples.md`, and
  `tools/style-inventory.mjs` (DOM measurement: type/color/spacing census,
  alignment near-misses, contrast, overflow).
- `DESIGN.md` — the design: the brief (input contract) and the review method,
  with the established UX methods they're adapted from.
- `evals/` — synthetic test apps + harness for exercising the skill. See
  `evals/README.md` for how to run a review and the seeded-defect detection eval.
