## Goal (as understood)

A non-technical marketing manager opens the dashboard a few times a week to read overall campaign performance vs target, identify which channels are over/under-performing, and check whether the period is on track — all fast, in plain language, without analytics jargon.
Reviewed on: Desktop 1280×900 (primary target). Also probed at 768px narrow.

---

## What's working

1. **Plain-language headline lands first.** The summary sentence ("you're behind target · 94% of your $414,000 goal · Display needs attention") answers the core job in one read before the persona touches any number.
2. **All three primary tasks complete successfully.** Revenue vs target, channel status, trend vs target line, and date-range switching all work correctly and update consistently. Freshness timestamp is prominently placed.
3. **Status is never color-only.** Every green/amber/red encoding is accompanied by a text label ("Ahead of target", "Behind target", "Close to target"), making the signal legible in grayscale and for users who don't register color differences.

---

## Findings (worst first)

### 1 — ROAS value formatted as a dollar amount, not a ratio

- **severity:** medium
- **principle:** clarity
- **scope:** KPI cards — "Return on ad spend" card
- **observation:** The ROAS value displays as `$3.70`, using dollar formatting that makes it read as a currency amount (e.g. revenue, cost). A non-technical marketer seeing this cold may interpret it as "$3.70 in revenue" — a confusingly small figure — rather than a 3.70× return multiplier. The clarifying phrase "per $1 spent" only appears in the smaller target line below.
- **why it matters:** The persona explicitly avoids analytics jargon and wants the "so what." A misread ROAS value delays the judgment ("is $3.70 good or bad?") that this KPI is meant to resolve at a glance. The status badge "Ahead of target" compensates, but it shouldn't carry the whole interpretive load.
- **suggested direction:** Display the ratio as `3.70×` (or `3.70x return`) instead of `$3.70`, so the format itself signals "a multiplier, not a price." Update the target text to match: `Target: 3.5× · Ahead`.

---

### 2 — Channel target-mark (black tick) is unexplained in the legend

- **severity:** low
- **principle:** discoverability / consistency
- **scope:** "How each channel is doing" panel
- **observation:** Each channel bar has a thin black vertical mark indicating the channel's revenue target. The legend explains fill-color meaning (green/amber/red) but does not mention the mark. Its meaning ("this is where target sits on the bar") is available only as a hover tooltip (`title` attribute), which is undiscoverable without mousing over and invisible on touch/keyboard navigation.
- **why it matters:** The persona who reads the bar visually — "Paid Social's fill stops well before the mark, so it's behind" — is using the correct visual logic, but only if they know what the mark means. Without it, they rely entirely on the text label, making the bar graphic decorative rather than informative. The text labels do deliver the verdict, so this doesn't break the task.
- **suggested direction:** Add a fourth legend entry: `— Target` with a small vertical-bar swatch. One line in the legend converts a hover-only encoding into a visible, learnable one.

---

### 3 — Ad spend card omits a status badge that every other card has

- **severity:** low
- **principle:** consistency
- **scope:** KPI cards — "Ad spend" card
- **observation:** Revenue, New customers, and Return on ad spend each carry a colored text badge below the progress bar ("Ahead of target", "Close to target"). The Ad spend card omits this badge by design (spend utilization is treated as neutral, not a performance signal). The result is a structural inconsistency: three cards have four rows, one card has three.
- **why it matters:** A marketer scanning all four cards expects the same anatomy. The missing badge creates a momentary pause ("did it fail to load?"). The "90% used" target line and neutral gray bar provide the utilization context, so the card still communicates — but the layout inconsistency is noticeable.
- **suggested direction:** Consider a neutral badge variant ("90% of budget used") in a gray/muted style that occupies the same position without implying positive/negative status. This preserves the card's intentional ambiguity while keeping all four cards visually consistent.
