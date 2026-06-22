# Eval runs

Two evals of the UX review (see `skills/ux-review/`). Reviewer/fixer model:
Sonnet. Apps under `evals/apps/`; defect ground truth under `evals/defects/`.

## 1. Detection — does the review catch known defects?
`detection/` — review of 5 marketing-dashboard variants with 15 seeded defects,
scored blind against ground truth in `detection/scorecard.md`.

- **Recall 8/15 overall, 5/8 high-severity, 0 spurious**, plus ~8 real *unseeded*
  bugs caught.
- Blind spot: **chart-perception** defects (hero-metric inversion, truncated
  y-axis, indistinguishable series) — judged from rendered pixels, not
  structure/text. Structural/textual defects (missing freshness, missing legend,
  broken color bars, missing context) were caught reliably.

## 2. Review→address loop — does the review drive improvement?
`loop/` — 3 clean apps × 3 iterations of independent review → fix. See
`loop/SUMMARY.md` for the progression table and analysis, and each
`loop/<app>/iterN/` for the report, code snapshot, and screenshots.

- Mediums trend down where fixes are real; the review **reliably re-finds** a
  high-severity bug until it's truly fixed (checkout) and **catches regressions**
  a fix introduces.

These are disposable run artifacts (safe to delete); they record what the review
produced, not library code.
