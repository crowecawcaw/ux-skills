# Full detection-eval matrix — 3 models × skill vs control, 2026-07-07

The complete run the earlier baseline and spot-checks built toward: every
defect variant (v1–v7, 21 seeded defects), reviewed blind by haiku, sonnet,
and opus, each in two modes:

- **skill** — the reviewer follows `skills/ux-review/SKILL.md` (checklists,
  style-inventory tool, fresh-eyes probes, precedents).
- **control** — the same model, same app access (URL, brief, screenshot
  helper), but only a vague prompt: *"give me feedback on the usability and
  visuals of this design."*

Grading: sonnet grader agents scored each report against
`evals/defects/marketing-dashboard-ground-truth.md` (element + problem named
= detected), spot-verified by hand against the report files. Skill-mode
haiku was hand-graded in the baseline run.

## The matrix (defects detected, of 21)

| mode ↓ / model → | haiku | sonnet | opus |
|---|---|---|---|
| **skill**   | 12.5 (+0 partial) | 18 (+1 partial) | **20** (+0 partial) |
| **control** | 8 (+3 partial)    | 12 (+4 partial) | 10 (+6 partial) |
| **skill lift** | **+4.5** | **+6** | **+10** |

By key severity band, skill mode: haiku high 4/8 · sonnet high 7/8 (+1
partial) · opus high 8/8. Control mode: haiku high 4/8 · sonnet high 7/8 ·
opus high 6/8.

## Answers to the two questions

**Is the skill or the model pulling the weight? Both — and they compound.**

- The skill lifts every model, and lifts the *strongest* model the most:
  opus goes 10 → 20. Under a vague prompt even opus does a shallow pass
  (~10–14 tool calls, top-of-mind findings only); the skill's staged process
  makes it spend the effort (~25–30 tool calls) where the defects live.
- The model matters just as much *within* skill mode: 12.5 → 18 → 20. Haiku's
  misses are semantic (absence blindness, register judgment); no amount of
  process fully fixed that at haiku scale.
- The only defects nobody caught in any cell: **v4-d1** (Revenue "$412K"
  beside Ad spend "$111,321") — and v4-d3 (ROAS "3.7x" vs "$3.50 per $1")
  fell only to skill/opus. Unit/format consistency needs an explicit
  checklist item or a tool check.

**What does the skill concretely buy?**

- **The measured defects.** v6 (9px misalignment, radii/shadow mix, type
  sprawl): skill sonnet/opus 3/3 and 3/3-with-splits vs control ~0–1/3 with
  *four false strengths* — the haiku control called the misaligned variant
  "production-ready", and no control run cited a measurement.
- **Chart honesty.** The truncated y-axis (v3-d2) was caught only in skill
  mode (opus fully; sonnet found-but-excused it). No control run mentioned it.
- **No false strengths.** Skill sonnet/opus: zero across 14 reports.
  Controls: 6+ (praising deleted freshness stamps, "consistent" misaligned
  grids, a donut described as bars).
- **Evidence discipline.** Skill reports cite measurements, probe answers,
  and precedents; control reports assert. Same model, different epistemics.

**What does the model buy?** Judgment the process can't force: haiku with the
full skill still praised v7's emoji copy and missed every v5 semantic
removal; sonnet/opus with the same instructions caught them.

## Cost

Per review (output tokens, approximate): control 31–48k; skill haiku 70–87k,
skill sonnet 102–136k, skill opus 82–114k. The skill costs ~2.5× tokens per
review and buys +4.5 to +11 detections of 21. Opus skill reviews were
cheaper than sonnet's — it worked more efficiently per stage.

## Caveats & integrity notes

- **Screenshot-dir collisions (fixed mid-run):** early control runs chose
  shared /tmp screenshot dirs while many reviewers ran concurrently, so some
  reviewed another variant's pixels (a haiku v4 control described v7's pastel
  cards; an opus v1 control saw "the app change between reloads"). All
  affected runs (haiku v1/v3/v4/v6, opus v1/v2/v3/v4/v5 controls) were rerun
  with isolated dirs; the matrix uses only clean runs. The CI runner
  (`run-evals.mjs`) already isolates per-job output dirs.
- **Variant-comment leaks (fixed):** v1's app.js and v6/v7's CSS carried
  comments confessing their seeds; scrubbed before this run's skill reviews
  of v6/v7 spot-checks were superseded. v3's app.js retains a neutral-toned
  comment rationalizing the y-axis zoom; the code itself reveals the same
  fact, and detection still required judging the harm (haiku read the source
  and still missed it).
- **Known base-app bugs** repeatedly rediscovered by strong reviewers (all
  modes): headline vs KPI-bar using different "close" thresholds (0.95 vs
  0.90); the ad-spend delta arrow following goodness instead of sign;
  identical +6.6% deltas across KPIs; muted-gray text at ~3:1 contrast; the
  channel list ordered by revenue while the headline names the ratio-best
  channel "strongest". These should be fixed (or excluded in the key) to
  drop the eval's noise floor.
- Single run per cell; expect ±1–2 variance (e.g. one haiku control caught a
  defect its skill run missed).

## Recommended next steps

1. Add a unit/format-consistency checklist item (and possibly a
   style-inventory check for same-kind numbers) — the only universally
   missed defect class.
2. Fix the base app's real bugs to drop the noise floor; re-baseline.
3. Skill-tune for haiku (comparative absence checks, forced tone-word
   judgments) if cheap reviews matter; otherwise sonnet is the sweet spot
   and opus the pre-ship gate.
4. Multi-reviewer thorough mode remains untested at matrix scale — worth one
   experiment on v5.
