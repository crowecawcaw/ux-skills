# Review→address loop eval

Tests whether the UX review **drives real UI improvement** when an agent fixes
against it. For each clean app: review → fix the high/medium findings → re-review
→ fix → re-review, 3 iterations. Each iteration here is an **independent** review
(fresh subagent, Sonnet, no memory of prior rounds) and an independent fix
subagent — so findings are not gamed, and counts need not fall monotonically (a
fresh reviewer surfaces issues earlier passes missed).

Per iteration we keep: `report.md` (the review), `app-snapshot/` (the code at
that point), and `shots/` (screenshots).

## Progression (findings by severity, high / medium / low)

| app | iter1 | iter2 | iter3 |
|---|---|---|---|
| marketing-dashboard | 0 / 2 / 1 | 0 / 2 / 2 | **0 / 1 / 2** |
| checkout | 1 / 2 / 2 | 1 / 1 / 2 | **1 / 1 / 2** |
| catalog | 0 / 2 / 2 | 0 / 2 / 1 | **0 / 1 / 2** |

## What happened

- **marketing-dashboard** — fixes landed (neutral utilization bar, distinct
  KPI deltas, text status badges, headline naming both "most revenue" and "most
  efficient"). The recurring delta-arrow/sign contradiction was caught again at
  iter2 and resolved by iter3. Ends with only minor polish (ROAS shown as "$3.70"
  not a ratio; one card missing a badge a sibling fix added).
- **catalog** — medium count trends down (2→2→1). The mobile-drawer fix at iter1
  surfaced a *new* medium (no active-filter badge), which iter2's fix addressed.
  A real residual: the "Featured/Relevance" sort is a relabel that still
  duplicates "Rating: high-to-low" — the reviewer keeps catching it because the
  fix was cosmetic.
- **checkout** — the **HIGH persists across all three iterations**. It's a
  genuinely hard multi-step edit-state bug: editing a step from the Review screen
  loses data. Each fix addressed the reported facet (cart-edit re-traversal →
  then payment-field repopulation), but the reviewer reliably re-caught a
  remaining data-loss path, and one fix introduced an adjacent regression. This
  is the most instructive case: the review is *consistent* about a high-severity
  problem the fixer couldn't fully close in the budget.

## Reading of the result

- The review **reliably re-finds high-severity problems** until they're truly
  fixed (checkout) and **confirms** fixes when they land (marketing deltas).
- Independent re-review is a feature, not noise: it catches regressions a fix
  introduces (checkout payment wipe, catalog filter badge) — exactly what an
  iterating agent needs.
- Severity-weighted load trends down where the fix is real and stalls where the
  fix is cosmetic or the bug is hard — so the loop measures *fix quality*, not
  just review verbosity.

## Caveats

- Small sample (3 apps, 3 iterations); single reviewer/fixer model (Sonnet).
- Two of three baselines started at 0 high, so headroom was mostly medium/low.
- Counts are independent-review counts, not a tracked defect ledger; use the
  per-iteration `report.md` for the actual findings.
