# Chart-perception verification — closing the detection blind spot

Follow-up to `scorecard.md`. The original detection run missed all 3 chart-
perception high-severity defects (judged from rendered pixels):

- **v1-d1** hero-slot inversion (Ad spend promoted over Revenue)
- **v3-d2** truncated y-axis (starts ~$8K, not $0, exaggerating movement)
- **v5-d1** indistinguishable series (target line same solid blue as actual)

**Fix:** added a **Chart perception** group to the `monitoring` list in
`skills/ux-review/checklists.md` (items 13–15), framed "read the rendered chart,
not the data behind it":

- 13 — honest baseline & scale (catches truncated axes)
- 14 — series distinguishable in the pixels, matching the legend (catches
  identical/indistinguishable series)
- 15 — no prominence inversion (catches a cost/vanity metric in the hero slot)

**Focused re-check (this session):** re-screenshotted the three screens that
surface the missed highs and applied items 13–15 directly to the rendered
pixels. Each item flips its miss:

| defect | screen (screenshot) | new item | outcome |
|--------|---------------------|----------|---------|
| v1-d1 hero inversion | v1 `01-kpis` | 15 | **caught** — "Ad spend $105,570" is the first/largest/tinted hero card; "Revenue $391,000" demoted to a plain card |
| v3-d2 truncated y-axis | v3 `03-trend-90d` | 13 | **caught** — value axis runs $8.0K→$16K, not from $0 (v5's chart, by contrast, starts at $0) |
| v5-d1 indistinguishable lines | v5 `03-trend-90d` | 14 | **caught** — rendered "Daily target" line is solid blue like the actual line, contradicting the legend's dashed-grey swatch |

This is a targeted perceptual re-check, not a full blind re-run of all 5
variants. To measure the full recall lift, re-run the detection eval per
`working.md` (review each `marketing-dashboard-defects/vN` against the clean
`brief.md`, then re-score against the ground truth). Expectation: the three
high-severity misses above flip to detected (high-severity recall 5/8 → 8/8).

Screenshots used: regenerate with
`node evals/shoot.mjs evals/apps/marketing-dashboard-defects/<v>/scenarios/<s>.json /tmp/mkt-verify/<v>`
(server: `python3 -m http.server 4010 -d evals/apps`).
