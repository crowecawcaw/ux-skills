# UX Review — Brightline Marketing Campaign Performance (v5)

## Goal (as understood)
A non-technical marketing manager needs to land on the dashboard, read overall revenue vs target, identify best and worst channels, and judge whether the period is on track — all within seconds, in plain language, without analytics jargon.

Reviewed on: Desktop 1280 × 900 viewport (primary review target per brief). All findings apply to this viewport.

---

## What's working

1. **Plain-language headline delivers the core story.** "Over the last 30 days, you brought in $391,000 — you're behind target (94% of your $414,000 goal). Email is your strongest channel; Display needs attention." This is exactly the "so what" the persona needs; the information is accurate and on the first line.
2. **Channel breakdown is clear and self-sufficient.** Color-coded bars, a target marker, a text label ("Ahead of target" / "Behind target"), and the dollar figure are all co-located. The persona can name the best and worst channel instantly; the legend reinforces the encoding.
3. **Freshness and range controls are visible and functional.** "Data as of Jun 22, 2026, 8:00 AM" is in the header; the date-range selector updates the headline, KPI cards, and channel figures correctly on change.

---

## Findings (worst first)

### 1. KPI cards silently drop target context — the promised per-card comparison is missing
- **severity:** high
- **principle:** feedback / hierarchy
- **scope:** KPI row (all four cards) — cross-screen
- **observation:** Each KPI card contains a progress bar track and a target text slot in the HTML and is documented in the brief as showing the metric "with its target." In this build, `renderKpi` unconditionally sets `targetEl.textContent = ""` and `barEl.style.width = "0%"`, so the bar is invisible and the target field is blank. The brief's success criterion ("each KPI card shown with its target") is not met for any card. The headline compensates for Revenue, but "New customers vs target", "Ad spend vs budget", and "ROAS vs target" have no context — the persona sees a raw number with no way to judge it good or bad.
- **why it matters:** The persona's stated pain point is "is 4,200 orders good or bad? Hard to tell." Without per-card target context, three of four KPIs are exactly that unresolvable number. The headline covers Revenue only; Spend, New Customers, and ROAS are orphaned.
- **suggested direction:** Restore the `targetEl` text and `barEl` fill that the `renderKpi` call already computes (`targetText` and `ratio` are passed in but ignored). A one-line progress bar (e.g. "Target $414K · 94% reached") under each card would give every metric the context the brief specifies.

---

### 2. Trend chart subtitle goes stale on range change — contradicts the selected window
- **severity:** high
- **principle:** feedback / consistency
- **scope:** Revenue over time panel
- **observation:** The subtitle below "Revenue over time" reads "Yesterday's revenue of $15,100 was above the daily target of $13,800." This text is set by `renderTrend` using the last data point of the current series. When the range changes to 90 days, the subtitle still references yesterday's single-day figure while the chart now shows the entire 90-day window — the subtitle is factually correct for the last day but misleadingly scoped to a single day rather than the selected window. The mismatch is visible in the 90-day screenshot where the headline says "Last 90 days … $1,102,900" but the chart sub says "Yesterday's revenue … $15,100".
- **why it matters:** The persona switched the range specifically to get a different time-window answer. The subtitle contradicts that intention by reverting to a single-day reference. A user who reads the subtitle as the chart's summary will form a wrong model of whether the 90-day period is tracking.
- **suggested direction:** Scope the subtitle to the selected window, e.g. "Over the last 90 days, daily revenue averaged $X vs the $13,800 target" — or anchor it clearly to "yesterday" only when the 7-day view is selected and the single-day reading is most relevant.

---

### 3. Ad Spend delta shows contradictory arrow + number ("▼ +6.6%")
- **severity:** medium
- **principle:** consistency / clarity
- **scope:** Ad spend KPI card — cross-screen (all ranges)
- **observation:** The `deltaGoodWhenUp: false` flag reverses the arrow class so a cost increase shows a red down-arrow to signal "bad direction." But the numeric sign is unchanged — the user sees "▼ +6.6% vs prior period." A downward-pointing arrow beside a positive percentage is self-contradictory: the arrow says "down" but the number says "up." This is visible in the 30-day, 7-day, and 90-day views.
- **why it matters:** The persona will be confused about whether spend went up or down. These are opposite readings. A marketing manager who reads "down arrow" may conclude spend dropped, when it actually rose 6.6% — a budget decision could be made on the wrong premise.
- **suggested direction:** Pick one encoding: either show a neutral or inverted arrow (▲ spend went up, colored red to signal "that's unfavorable") while keeping the positive sign, or negate the value so the displayed percentage matches the arrow direction. The simplest fix: keep the ▲ arrow for "spend rose," color it red/amber rather than green to signal cost pressure, and keep the "+6.6%" so number and arrow are consistent.

---

### 4. "Close to target" legend entry appears for a state that no channel is in
- **severity:** medium
- **principle:** clarity / consistency
- **scope:** Legend and channel breakdown panel
- **observation:** The legend shows three swatches — Ahead / Close / Behind. In every range tested (7-day, 30-day, 90-day), all five channels are either green (ahead) or red (behind); none is amber ("Close to target", ratio >= 0.90 and < 1.0). The amber swatch is visible but refers to nothing in the panel beside it. The legend is positioned directly above the channel chart, making the orphaned entry look like an error or a loading artifact.
- **why it matters:** A user who scans the legend and then hunts for the amber state will not find it and may doubt whether the chart loaded correctly or whether a channel is missing. It also trains the user that legend items may be decorative — reducing trust in the legend when it matters.
- **suggested direction:** Either hide legend entries whose state is absent from the current data, or acknowledge the absence ("No channels in this range are close to target"). If the data is expected to produce all three states under normal conditions, this is acceptable as-is; but the layout should not reserve equal visual prominence for an unused state.

---

### 5. KPI progress-bar track visible with no fill — looks broken
- **severity:** low
- **principle:** feedback
- **scope:** KPI row (all four cards)
- **observation:** The HTML has a `<div class="kpi-bar"><div class="kpi-bar-fill"></div></div>` structure in every card. The bar track (a light gray rail) is rendered and visible in the UI, but the fill is set to 0% width, so only the empty track appears. Users see a slim horizontal rail below each delta line with no fill — a classic "loading" or "broken bar chart" visual.
- **why it matters:** This is low severity only because the user's goal can still be met via the headline and channel bars. But the visible empty bar track communicates "something should be here but isn't" and erodes trust in the completeness of the dashboard — particularly for a persona who checks figures a few times a week and may notice the persistent empty state.
- **suggested direction:** Either restore the fill (see Finding 1) or, if the progress bar is intentionally removed from this build, remove the bar track element from the DOM entirely so there is no phantom UI element.
