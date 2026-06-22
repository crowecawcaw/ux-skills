# Detection Eval Scorecard

**Eval run:** detection
**Variants:** v1–v5
**Seeded defects:** 15
**Date scored:** 2026-06-22

---

## Per-Variant Results

### v1

| Defect ID | Description | Expected Severity | Detected | Matching Finding | Reviewer Severity |
|-----------|-------------|:-----------------:|:--------:|------------------|:-----------------:|
| v1-d1 | KPI row hero slot — Ad Spend promoted, Revenue demoted | HIGH | NO | — | — |
| v1-d2 | Top bar — freshness timestamp missing entirely | HIGH | YES | F2: "Data-freshness timestamp absent on all views" | HIGH |
| v1-d3 | Revenue card — no delta/target/progress bar | MEDIUM | YES | F1: "Revenue KPI card shows no target, no delta, and no progress bar" | HIGH |

**v1 score: 2/3 detected**

Non-seeded findings: F3 (ad-spend delta arrow contradiction — real, pre-existing cross-variant), F4 ("Close to target" legend entry never appears — real observation).

Severity notes: v1-d3 over-rated (MEDIUM seeded, called HIGH).

---

### v2

| Defect ID | Description | Expected Severity | Detected | Matching Finding | Reviewer Severity |
|-----------|-------------|:-----------------:|:--------:|------------------|:-----------------:|
| v2-d1 | Channel bars all same brand-blue, no color differentiation + legend deleted | HIGH | YES | F1: "Channel bars carry no color information; all bars render identically" / F2: "Legend is absent" | HIGH |
| v2-d2 | Status text all same muted grey, behind-target not visually distinct | MEDIUM | YES | F1 (secondary note): "The status text … is also uniform gray for all states — no color or weight differentiation" | HIGH |
| v2-d3 | Channel name column 64px, labels truncate ("Paid Se…") | LOW | YES | F4: "Channel names are truncated" | MEDIUM |

**v2 score: 3/3 detected**

Non-seeded findings: F3 (ad-spend delta arrow — real, pre-existing), F5 (ROAS % reached consistency — real issue in app, not a v2 seeded defect).

Severity notes: v2-d2 over-rated (MEDIUM seeded, included in HIGH finding); v2-d3 over-rated (LOW seeded, called MEDIUM). v2-d1 split across two findings (F1, F2) but both map to the same seeded defect.

---

### v3

| Defect ID | Description | Expected Severity | Detected | Matching Finding | Reviewer Severity |
|-----------|-------------|:-----------------:|:--------:|------------------|:-----------------:|
| v3-d1 | Channel panel rendered as donut/pie instead of bar, drops vs-target comparison | HIGH | YES | F1: "Channel panel shows revenue share, not performance vs target" | HIGH |
| v3-d2 | Trend chart y-axis truncated (starts at ~96% of min, not $0), exaggerates movement | HIGH | NO | — | — |
| v3-d3 | Axis labels 8px near-white (#c4ccd6) — hard to read | LOW | NO | — | — |

**v3 score: 1/3 detected**

Non-seeded findings: F2 (legend scope mismatch from donut — real consequence, distinct from v3-d1), F3 (ad-spend delta arrow — real, pre-existing), F4 (trend chart subtitle not adapting to date range — real), F5 (ad-spend KPI bar and delta give opposite color signals — real).

Severity notes: No miscalibration on the one detected defect.

---

### v4

| Defect ID | Description | Expected Severity | Detected | Matching Finding | Reviewer Severity |
|-----------|-------------|:-----------------:|:--------:|------------------|:-----------------:|
| v4-d1 | KPI cards — Revenue "$412K" abbreviated vs Ad Spend "$111,321" full, inconsistent units | MEDIUM | NO | — | — |
| v4-d2 | Trend chart x-axis — label at every data point, overlaps into illegible smear at 30/90-day | HIGH | YES | F3: "Trend chart x-axis labels are illegible at 30-day and 90-day ranges" | MEDIUM |
| v4-d3 | ROAS card shows "3.7x" but target shows "Target $3.50 per $1 spent" — different units/formats | MEDIUM | NO | — | — |

**v4 score: 1/3 detected**

Non-seeded findings: F1 (ad-spend delta arrow — real, pre-existing), F2 (Revenue KPI bar color conflicts with headline status text — real consistency issue), F4 (legend scope ambiguous — real).

Severity notes: v4-d2 under-rated (HIGH seeded, called MEDIUM) — the most concerning miscalibration across all variants.

---

### v5

| Defect ID | Description | Expected Severity | Detected | Matching Finding | Reviewer Severity |
|-----------|-------------|:-----------------:|:--------:|------------------|:-----------------:|
| v5-d1 | Trend chart actual line and target line same solid brand-blue (indistinguishable) | HIGH | NO | — | — |
| v5-d2 | All KPI cards — target/% reached/progress bar removed, only bare figure + delta | HIGH | YES | F1: "KPI cards silently drop target context" | HIGH |
| v5-d3 | "Close to target" reuses same red as "Behind target" in channel status | MEDIUM | NO | — | — |

**v5 score: 1/3 detected**

Non-seeded findings: F2 (trend chart subtitle stale on range change — real, also seen in v3 review), F3 (ad-spend delta arrow — real, pre-existing), F4 ("Close to target" legend entry unused — real observation, but misses that the actual defect is the color reassignment to red), F5 (empty progress-bar track visible — real visual artifact, supplementary to v5-d2 detection).

Severity notes: v5-d3 missed entirely; F4's "Close to target" observation interprets the defect as a data/dataset issue rather than a color-encoding error.

---

## Overall Summary

### Detection Metrics

| Metric | Count | Rate |
|--------|------:|-----:|
| Total seeded defects | 15 | — |
| Detected | 8 | **53%** |
| Missed | 7 | 47% |
| High-severity seeded (v1-d1, v1-d2, v2-d1, v3-d1, v3-d2, v4-d2, v5-d1, v5-d2) | 8 | — |
| High-severity detected | 5 | **63%** |
| High-severity missed | 3 | 38% |
| Spurious findings (non-seeded, not real) | 0 | — |

### Real-Unseeded Catches

Approximately 8 distinct genuine issues surfaced across all reviews that were not in the seeded defect set:

1. **Ad-spend delta arrow contradiction** (pre-existing cross-variant) — flagged in all 5 variant reviews
2. **Trend chart subtitle stale on range change** — flagged in v3 and v5 reviews
3. **ROAS "% reached" consistency missing** — flagged in v2 review
4. **"Close to target" legend entry never appears in dataset** — flagged in v1 and v5 reviews
5. **Legend scope ambiguous** — flagged in v4 review
6. **Revenue KPI bar color vs headline threshold mismatch** — flagged in v4 review
7. **Ad-spend bar and delta give opposite color signals** — flagged in v3 review
8. **Legend/donut mismatch** (legend describes bar states but chart is a donut) — flagged in v3 review

No spurious findings: every non-seeded observation corresponded to a real issue in the app.

### Severity Miscalibration

| Defect | Seeded Severity | Reviewer Severity | Direction |
|--------|:--------------:|:-----------------:|:---------:|
| v1-d3 | MEDIUM | HIGH | Over-rated |
| v2-d2 | MEDIUM | HIGH (inside F1) | Over-rated |
| v2-d3 | LOW | MEDIUM | Over-rated |
| v4-d2 | HIGH | MEDIUM | **Under-rated** |

### Notable Misses

1. **v1-d1 — Hero slot hierarchy inversion.** The most architecturally significant v1 defect. The review identified that Revenue lacked context but never named the inversion itself: that Ad Spend was wrongly elevated to the largest/primary hero slot while Revenue was demoted.
2. **v3-d2 — Truncated y-axis.** A high-severity misleading-axis defect was completely absent from the v3 review. The chart exaggerating revenue movement by starting near the minimum rather than $0 went unnoticed.
3. **v4-d1 and v4-d3 — Unit/format inconsistency in v4.** Two medium-severity formatting defects (abbreviated vs full currency units across KPI cards; ROAS multiplier vs per-dollar-spent target format) were both missed; only the x-axis label overlap was caught in v4.
4. **v5-d1 — Indistinguishable trend lines.** A high-severity color-meaning defect (actual vs target lines rendered in identical brand-blue) was not flagged in the v5 review.
5. **v5-d3 — "Close to target" color reassigned to red.** Finding 4 in v5 noticed the amber "Close to target" state was absent but attributed it to the dataset; it did not identify the defect that "Close to target" was actively rendered in the same red used for "Behind target."

---

## Verdict

The reviewer achieved a 53% overall recall (8/15 seeded defects) and 63% recall on high-severity defects, with no spurious findings and roughly 8 genuine non-seeded issues also surfaced. Precision is high — every flagged observation corresponded to a real problem — but recall drops sharply for defects requiring cross-card comparison (unit inconsistency, format mismatch) and for chart-encoding subtleties (truncated y-axis, indistinguishable line styles). The single most concerning calibration error is v4-d2, where a HIGH-severity illegibility defect was rated MEDIUM; the consistent pattern of over-rating medium/low defects (v1-d3, v2-d2, v2-d3) alongside this one under-rating suggests the reviewer's severity scale is compressed toward the high end for visual-clarity issues.
