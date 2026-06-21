# Worked examples

A short, fictional example of each stage's file — copy the **shape**, not the
content. The app below ("Expensr") is a placeholder to show format only; never
import its findings into a real review.

> Placeholder brief: **Expensr** — submit a work expense for reimbursement.
> Persona: a non-finance employee who wants to get paid back fast.
> `surface_type: guided-flow`. Core task: *submit one expense and know it's filed.*

---

## `raw.md` (Stage 1)

```
# Expensr UX Review — Raw Pass
Reviewed on: Desktop 1280×900

## Stage 1.2 — Task completion (headline check)

### Task: Submit one expense and know it's filed
Completion: ✗ BREAKS — at the Review step (04-review.png) the "Submit" button is
disabled with no explanation; the persona can't tell what's missing or finish.
Promise check: onboarding says "Submit in under a minute" — not delivered; the
persona stalls at Review with no path forward.

## Stage 1.3 — Encoding inventory (app-level)
| Encoding | Where | Meaning |
|---|---|---|
| green check | field rows | field validated ✓ consistent |
| amber dot | category pills | no discernible meaning — same amber on unrelated pills |
| red text | errors only | error ✓ consistent, also carries an icon |

## Stage 1.4 — Per-screen checklist

### Screen: Amount entry (02-amount.png)  [surface: guided-flow]
- next-action clear (item 2): ✓ single "Next" button, prominent
- right input/keyboard (item 7): ✗ amount field opens a text keyboard on mobile (03-mobile.png)
- inline validation (item 8): ✓ validates on blur, confirms with the green check
- spine — consistent color meaning: ✗ amber dot on pills has no meaning (see inventory)

### Screen: Review (04-review.png)
- next-action clear (item 2): ✗ "Submit" disabled, no reason shown
- progress/where-am-I (item 9): ✓ "Step 3 of 3" shown
```

Note: answer passing items too (the `✓`s) — they're how coverage is proven.

---

## `findings.md` (Stage 2)

```
# Expensr — Findings

## F1 — Can't submit at Review (HIGH)
From raw: Stage 1.2 BREAK + Review item-2 ✗. The core task can't complete:
Submit is disabled with no stated reason. Headline; blocks the job.

## F2 — Amber pill dots are meaningless (LOW)
From raw: inventory + amount-screen spine ✗. A color with no meaning adds minor
noise; doesn't block the task. Kept as low.

## Dropped (failed an item, no real impact)
- Mobile amount keyboard (item 7 ✗): real, but the persona is desktop-primary
  per the brief → no finding.
```

Each `✗` is a *candidate*; promote only what affects the goal, and say where you
dropped one and why.

---

## `report.md` (Stage 3)

Use the output format in `SKILL.md`. One finding, filled, for shape:

```
### 1. Can't submit at the Review step
- severity: high
- principle: feedback / next-action clarity
- scope: Review screen
- observation: "Submit" is disabled with no message saying what's incomplete (04-review.png).
- why it matters: This is the core task's final step — the persona reaches the
  end and cannot file the expense or tell what's wrong, so the job fails.
- suggested direction: Enable Submit, or show inline what's missing and link to it.
```
