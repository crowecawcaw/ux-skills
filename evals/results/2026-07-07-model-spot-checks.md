# Model spot checks — Sonnet & Opus on v5/v7, 2026-07-07

Follow-up to the Haiku baseline (`2026-07-07-haiku-baseline.md`): do bigger
models close Haiku's gaps? Spot-checked on the two variants that separated
hardest — v5 (semantic sabotage; Haiku 0/3) and v7 (tone; Haiku 1.5/3). Same
setup: blind, skill-mode, single pass, inline stages, fresh-eyes probes.

| variant | Haiku | Sonnet | Opus |
|---|---|---|---|
| v5 | 0/3 | **3/3** | **3/3** |
| v7 | 1.5/3 | **3/3** | **3/3** |

## Notes

- **Both models fully close the semantic-blindness gap.** On v5 they caught the
  stripped KPI context as the headline (Opus traced `renderKpi()` computing
  targets it never renders; Sonnet flagged the dead progress-bar affordance),
  the legend-vs-pixels target-line mismatch, and — both — the *latent*
  close-reuses-red collision that no current data even triggers.
- **Probes used adversarially.** Opus showed a context-free probe only the
  chart: it insisted the target line was "dashed grey, 95% confident," citing
  the legend — direct evidence users read the legend, not the pixels.
- **Register judgment works at Sonnet+.** Both quoted the brief's tone words
  and named specifics; Opus found the sharpest cue in the variant (a party
  emoji decorating the *bad-news* clause). Haiku had praised that same copy.
- **Real base-app bugs surfaced.** Sonnet found the headline (≥0.95) and KPI
  bar (≥0.90) using different "close to target" thresholds, so 94% reads
  "behind" and amber "close" simultaneously — Haiku's v3 reviewer had
  independently flagged the symptom. Both models also correctly diagnosed the
  ad-spend delta arrow following goodness instead of sign. Candidates for a
  base-app cleanup, after which the eval noise floor drops.
- **Severity calibration:** both graded v7's pastel washes high (above the
  aesthetic medium cap) via a comprehension argument — the green wash on a
  behind-target card asserts the opposite of the truth. Defensible; the cap
  language may need a carve-out for decorative color that collides with a
  semantic palette.
- **Leak caveat:** these v7 runs predate the scrub of a CSS comment
  ("purely decorative — encodes nothing") left by the variant builder; both
  models cited it as corroborating evidence. Detection stands on the rendered
  pixels (Haiku found the pastels without understanding them), but v7 numbers
  from these spot checks are mildly comment-assisted. The full matrix run
  happens post-scrub.
- Cost note: Sonnet ~126–136k tokens/review, Opus ~95–114k, Haiku ~70–87k.
  Opus was *cheaper* than Sonnet here — it worked more efficiently per stage.

## Verdict

The skill gives Haiku a strong measurement-and-process floor, but semantic
and register judgment need Sonnet or above. Sonnet matches Opus on detection
in these two spot checks at similar cost; Opus's reports read noticeably
sharper (root-cause tracing into source, calibration language). Full matrix
(3 models × 7 variants × skill+control) to follow.
