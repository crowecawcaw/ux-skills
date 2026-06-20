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

- **For agents primarily, humans second.** We want to unlock agents to produce
  better UI designs through quality feedback. Feedback should be legible,
  efficient, and effective for agent iteration. Success is measured with agent
  evals, not human feedback. It will likely be useful for people too, but that's
  incidental.
