# Detection eval run — Haiku reviewers, 2026-07-07

First full run of the detection eval after the measured-aesthetics /
fresh-eyes / precedents skill upgrade. Question under test: **can a small
model (Haiku) do a good review with good instructions?**

Setup: 8 parallel reviewers (claude-haiku-4-5), one per app (v1–v7 + clean
baseline), each following `skills/ux-review/SKILL.md` inline, blind (no ground
truth, no access to other apps). Each ran the happy-path scenarios, the
style-inventory tool, the checklists, and spawned context-free fresh-eyes
probe subagents. Graded by hand against
`evals/defects/marketing-dashboard-ground-truth.md`. Cost: ~70–87k tokens per
review.

## Scorecard

| variant | detected | notes |
|---|---|---|
| v1 | 2/3 | d2 freshness ✓ (headline, traced to missing element); d3 revenue context ✓ (graded high vs key medium); d1 hierarchy inversion ✗ — *saw* `.kpi-hero` on Ad spend but diagnosed it as an 8.8px height bug, missed the prominence story |
| v2 | 3/3 | d1 all-blue bars + deleted legend ✓ headline; d2 grey status text ✓ (merged into d1, as the skill encourages); d3 truncation ✓ via overflow measurements (graded high vs key low) |
| v3 | 2/3 | d1 donut ✓ (a fresh-eyes probe conflated share with performance — probe evidence drove the catch); d3 8px labels ✓ with 1.62:1 ratio; d2 truncated y-axis ✗ despite an explicit checklist item |
| v4 | 1/3 | d2 overlapping dates ✓ headline with measured overlaps; d1 $412K-vs-$111,321 units ✗; d3 3.7x-vs-$3.50 units ✗ |
| v5 | 0/3 | d1 indistinguishable target line ✗ (chart even credited as working); d2 KPI context stripped ✗ (absence never noticed); d3 close-reuses-red ✗ (credited "green/red/orange consistent" — false strength) |
| v6 | 3/3 | 9px offset ✓, 6px panel indent ✓ (via CSS confirm — beyond what the tool flags), shadow + radii ✓, 17-vs-19px titles + 11px labels ✓. One calibration miss: misalignment+shadow bundled as high (cap is medium) |
| v7 | 1.5/3 | d3 Comic Sans ✓ (via font census; sandbox can't render it); d2 pastels ~half — flagged and fix removes them, but framed as contrast, gradient topbar unmentioned; d1 playful copy ✗ — **credited the emoji headline as a strength** against the stated tone constraint |
| clean | n/a | Noise floor: 4 findings, all real measurements (contrast, type sprawl, hero-card height), zero fabrications — but two graded high |

**Total: ~12.5/21 (60%).** By severity: **high 4/8 (50%) · medium ~4.5/9 (50%) ·
low 4/4 (100%)** — a striking inversion: everything the style-inventory tool
can measure gets caught; the misses are all semantic.

## What worked

- **The measurement path carries Haiku.** v6 (craft variant) went 3/3 with
  exact deltas cited; every low-severity defect across the run was caught.
  Reviewers used the tool's numbers correctly and confirmed them in
  screenshots/source.
- **Fresh-eyes probes earn their keep.** Nested context-free probes ran fine,
  and one directly produced the v3 donut catch (the probe misread share as
  performance — exactly the defect's harm).
- **Precedents get cited in reasoning** (v1's freshness finding, v2's color
  conventions), making findings read like a designer's, not a linter's.
- **No fabricated findings anywhere** — the evidence rules held; the clean-app
  report contains only real measurements.
- Process compliance was perfect: all three stage files, all sections, every
  report followed the format.

## Failure modes (ranked by cost)

1. **Absence blindness.** Things that *should be there and aren't* go
   unnoticed: v5's stripped KPI context, v5's collapsed color scheme, v1's
   hierarchy inversion (evidence seen, story missed). Checklist items exist
   for all of these; the raw pass rubber-stamps them ✓ instead of actually
   comparing.
2. **Rendered-chart checks skipped.** v5-d1 (two identical lines vs a legend
   claiming they differ) and v3-d2 (truncated y-axis) both have dedicated
   checklist items (monitoring #13/#14) and both were missed. The items are
   answered from the data's plausibility, not the pixels.
3. **Register judgment fails against stated tone.** v7's emoji/exclamation
   copy was *praised* as "conversational and directive" despite the brief's
   "professional, calm, plain-spoken" constraint. Haiku resolves the
   plain-language-vs-playful tension wrong unless forced to quote the tone
   words and judge each copy element against them.
4. **Format/unit consistency pairs missed.** v4's $412K-vs-$111,321 and
   3.7x-vs-$3.50 have no sharp checklist item ("do same-kind numbers share
   format and scale?") — the closest item (context & precision) didn't bite.
5. **Base-app noise dominates reports.** The clean app's real contrast debt
   (~24 failures) and type sprawl appear as the top findings in *every*
   report, graded up to high, burying seeded defects. Also mild severity
   inflation overall (2 lows graded high; 1 aesthetic high past the cap).

## Recommendations

- **Skill:** make absence checks comparative — for context/encoding items,
  require the raw pass to enumerate what each *sibling* element shows and
  state the odd one out (a "compare across the row" instruction). Make chart
  items #13/#14 require reading the axis minimum and tracing each legend
  entry to visible pixels before ticking. Register items: quote the brief's
  tone words and judge headline/labels/freshness copy against each, one line
  per element.
- **Add a consistency item:** "adjacent same-kind values share unit, scale,
  and format" (catches v4-d1/d3).
- **Base app:** either fix the clean app's real contrast/type debt (so the
  eval's noise floor drops) or list those traits in the ground truth as
  known-and-excluded.
- **Calibration:** the medium cap for aesthetic findings needs restating at
  Stage 3 (v6 pushed one to high); severity definitions could carry one
  example each of over-grading.
- **Re-run after skill fixes** with the same setup to measure the delta; then
  run the same set on Sonnet to price the model gap (v5 is the variant most
  likely to separate models).

## Verdict

A small model with good instructions gets you a **reliable craft/measurement
reviewer and a ~50% semantic-defect reviewer**. The instructions are doing
real work — everything scaffolded by a tool, a probe, or a precedent lands;
everything left to unforced judgment is a coin flip. The gap is addressable
in the skill (forcing functions for comparisons) before reaching for a bigger
model.
