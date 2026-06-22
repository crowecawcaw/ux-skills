# UX Review — Brightline Marketing Campaign Performance (v3 defect variant)

## Goal (as understood)
A non-technical marketing manager checks the dashboard a few times a week to read overall revenue vs target, identify the best and worst channel by performance (not just size), and confirm they're on track — all in plain language, within seconds, without analytics jargon.

Reviewed on: 1280 × 900 desktop viewport (primary target per brief). All findings are device-agnostic for this single-screen app.

---

## What's working

1. **Headline summary delivers the core story instantly.** The plain-language sentence ("you brought in $391,000 — you're behind target … Email is your strongest channel; Display needs attention") names revenue, on-track status, best and worst channel, and updates correctly when the date range changes. The persona can orient in under five seconds.

2. **KPI cards with progress bars and prior-period deltas.** Each card shows the value, a percentage change vs. prior period (with directional arrow and color), a target line, and a progress bar in green/amber/red. The legend directly above the bottom panels explains the color meaning. The freshness timestamp is present and prominent.

3. **Trend chart is readable and correctly labeled.** The "Revenue over time" line chart uses length/position (not angle or area), has a visible dashed daily-target line with a legend, and a subtitle that calls out whether yesterday beat target. Switching date range updates the chart and KPI values.

---

## Findings (worst first)

### 1 — Channel panel shows revenue share, not performance vs target

- **severity:** high
- **principle:** feedback, discoverability
- **scope:** "How each channel is doing" panel (all date ranges)
- **observation:** The channel breakdown is a donut chart labeled "Share of revenue by channel." Each channel shows its dollar revenue share — but no target, no performance ratio, and no status indicator (green/amber/red). The underlying data has a per-channel performance index (e.g. Display = 0.66, Paid Social = 0.83) but it is never rendered anywhere on screen.
- **why it matters:** The brief's second primary task is explicitly "identify the strongest and weakest channels and read each vs target … tell the difference visually without reading every number." The success criterion requires naming which channels are ahead/behind target from a visual cue. This panel fails that task entirely. The headline sentence provides a one-line partial answer, but the channel panel — the obvious place to go for detail — provides no status information at all.
- **suggested direction:** Replace or augment the donut with a per-channel horizontal bar showing each channel's revenue vs. its target (or a performance-ratio bar), colored with the existing green/amber/red status system. This lets the persona scan channel status in one pass.

---

### 2 — Status legend visually implies it explains the channel donut, but it does not

- **severity:** high
- **principle:** consistency, clarity
- **scope:** Legend strip + channel panel (cross-screen; all date ranges)
- **observation:** The green/amber/red legend ("Ahead of target · Close to target · Behind target") sits immediately above the two bottom panels — Revenue over time and How each channel is doing. The channel donut uses five completely different colors (blue, purple, teal, green, orange) that encode channel identity, not performance status. A user reading the legend and then looking at the channel panel finds no match. The legend that visually appears to explain both bottom panels actually explains only the KPI progress bars above.
- **why it matters:** A user who relies on the legend to interpret the channel panel will be misled about which channels are on track. Green in the legend means "ahead of target"; teal in the donut means "Email." These are unrelated color systems that share visual proximity. This false implication directly blocks the channel-performance task, compounding finding #1.
- **suggested direction:** Anchor the legend immediately below the KPI cards and before the bottom grid, making its scope clear. If the channel panel is redesigned to use the status color system (see finding #1), a single legend can then serve both panels correctly.

---

### 3 — Ad spend delta arrow direction contradicts the sign of the number

- **severity:** medium
- **principle:** consistency, clarity
- **scope:** Ad spend KPI card (all date ranges)
- **observation:** The ad spend card shows "▼ +6.6% vs prior period" in red (30-day view). The ▼ arrow conventionally signals the value decreased; the "+6.6%" sign signals it increased. The code uses ▼ to mean "this is bad news" (spend rose), not "the value is lower." Every other KPI card uses ▲/▼ to indicate direction of movement, not desirability. Color (red) correctly signals the concern, but the down arrow directly contradicts the positive number.
- **why it matters:** The non-technical persona parsing "▼ +6.6%" will either be confused or infer spend went down — the opposite of the truth. A marketer checking whether they are over-spending could misread this and proceed with incorrect information.
- **suggested direction:** Use ▲/▼ as directional indicators only (value went up or down) and rely on color alone for the good/bad signal. Spend increasing would read "▲ +6.6% vs prior period" in red — correctly showing both direction and concern. This matches standard finance and analytics dashboard conventions.

---

### 4 — Trend chart subtitle does not adapt to the selected date range

- **severity:** medium
- **principle:** feedback, consistency
- **scope:** Revenue over time panel (all date ranges)
- **observation:** The subtitle under "Revenue over time" always reads "Yesterday's revenue of $15,100 was above the daily target of $13,800" regardless of whether the user has selected Last 7, 30, or 90 days. Switching to 90 days updates the chart, headline, and KPI cards — but the subtitle stays fixed at yesterday's single-day figure, unchanged.
- **why it matters:** When the persona switches to 90 days for a broader view, the persisting "Yesterday's revenue" subtitle creates confusion: it appears to be chart-contextual narration but describes only one day. A user who notices the subtitle didn't change may doubt whether the chart itself updated. Trust in data freshness and correctness is a stated emotional success criterion in the brief.
- **suggested direction:** Make the subtitle window-aware. For multi-day ranges, summarize the trend for that period (e.g., "Over the last 30 days, revenue averaged $13,033/day vs the $13,800 target"). The yesterday callout can remain as a secondary note or be reserved for the default view.

---

### 5 — Ad spend KPI bar and delta give opposite color signals on the same card

- **severity:** low
- **principle:** consistency
- **scope:** Ad spend KPI card (all date ranges)
- **observation:** Within the Ad spend card, the progress bar is green (spend is under its budget cap — correctly inverted logic: under budget = good) while the delta text is red (spend increased vs. prior — correctly flagged as a concern). On a single glance, one element says "good" and another says "bad" for the same metric.
- **why it matters:** The persona scanning KPI cards registers conflicting signals on the spend card. While both signals are technically correct for different sub-questions, the visual conflict adds cognitive load for a non-technical user already in a hurry.
- **suggested direction:** Disambiguate by labeling what each signal measures ("Budget headroom" for the bar, "vs. prior spend" for the delta). Alternatively, use neutral gray for the budget-utilization bar on spend and reserve color for the delta, making clear the bar is not a performance rating.
