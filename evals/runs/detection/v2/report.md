## Goal (as understood)

A non-technical marketing manager opens the Brightline Campaign Performance dashboard a few times a week to check overall revenue vs target, identify the best and worst channels, and read the trend — then move on. Success means they can answer those three questions within seconds from plain-language cues and clear visual signals.

Reviewed on: Desktop 1280×900 (Chrome/Playwright). All findings are on this viewport; layout reflow to mobile was not the primary focus.

---

## What's working

1. **Plain-language headline answers the "so what" immediately.** The opening sentence ("you're behind target · 94% of your $414,000 goal · Email strongest; Display needs attention") gives the marketer the story before they read a single number. Updates correctly when the date range changes.
2. **Freshness label is visible on cold load.** "Data as of Jun 22, 2026, 8:00 AM" appears top-right without scrolling; the persona can trust the numbers.
3. **Date-range switch is smooth and consistent.** Changing from 30 to 90 days updates the headline, all four KPI cards, and the trend chart in unison with no stale data visible.

---

## Findings (worst first)

### F1 — Channel bars carry no color information; all bars render identically

- **severity:** high
- **principle:** consistency / semantic color / feedback
- **scope:** "How each channel is doing" panel (cross-screen — present on every date range)
- **observation:** Every channel bar is solid brand-blue regardless of whether the channel is ahead, close to, or behind target. The CSS explicitly overrides `fill-good`, `fill-warn`, and `fill-bad` to `var(--brand)` for `.channel-fill`. The status text ("Ahead of target" / "Behind target") is also uniform gray (`var(--ink-soft)`) for all states — no color or weight differentiation. The task brief says the persona should "tell the difference visually without reading every number," but every bar looks identical.
- **why it matters:** The brief's Task 2 success criterion is that the persona can *visually* distinguish ahead-of-target channels from behind-target ones at a glance. With uniform blue bars and gray status text, there is no pre-attentive signal — they must read every label to decode performance. For a marketer in a hurry, this collapses the channel panel into a table of text, defeating its purpose.
- **suggested direction:** Apply the existing `--good` / `--warn` / `--bad` color tokens to `.channel-fill` (remove the overriding rule that forces all to `var(--brand)`), and mirror those colors in the `.channel-status` text. This makes "ahead" channels instantly identifiable without adding new concepts.

---

### F2 — Legend is absent; the visual encoding for channel status has no key

- **severity:** high
- **principle:** discoverability / learnability
- **scope:** "How each channel is doing" panel; the `.legend` CSS class is defined but no `.legend` HTML element exists in index.html
- **observation:** The brief's happy-path for Task 2 reads "Use the legend to read the color meaning (ahead / close / behind target)." No legend is rendered anywhere on the page. The `.legend`, `.legend-item`, `.swatch`, `.swatch-good`, `.swatch-warn`, `.swatch-bad` CSS rules are defined but the corresponding HTML block is missing. The scenario script (`02-channels.json`) attempts to screenshot `.legend` and times out with element-not-found.
- **why it matters:** Even if the bar colors were restored (F1), a first-time user landing on the channel panel has no way to learn what color means what without a legend. The persona explicitly doesn't think in analytics jargon; they rely on in-context labels and keys. A missing legend leaves the color encoding unlearnable.
- **suggested direction:** Add the legend HTML block inside `.panel-channel`, above `#channel-list`, using the existing CSS: three `legend-item` spans with `swatch-good` / `swatch-warn` / `swatch-bad` swatches labeled "Ahead of target," "Close to target," "Behind target." The styles are already in place; this is a missing HTML block.

---

### F3 — Ad Spend delta shows a down-arrow on a positive number, contradicting itself

- **severity:** medium
- **principle:** consistency / clarity
- **scope:** Ad Spend KPI card
- **observation:** The Ad Spend card shows "▼ +6.6% vs prior period" — a down-pointing red arrow next to a positive percentage. The intent is correct (spend rising is unfavorable), but the symbol and the sign contradict each other: "▼" conventionally means "the number went down," yet "+6.6%" says it went up. The arrow encodes *desirability*, the sign encodes *direction*, and there is no label explaining the distinction.
- **why it matters:** A non-technical marketer reads "▼ +6.6%" as conflicting information. They may think spend fell when it rose, or dismiss the red as an error. For a spend-sensitive metric this misread matters: underestimating ad spend growth could leave them with false confidence about budget efficiency.
- **suggested direction:** Either align arrow direction with actual numeric direction (▲ for increases, ▼ for decreases) and use color alone for desirability — or replace the arrow with a neutral direction indicator and a colored badge for "above prior period." The key fix is that the shape and sign must not contradict each other.

---

### F4 — Channel names are truncated and unreadable at a glance

- **severity:** medium
- **principle:** clarity / legibility
- **scope:** "How each channel is doing" panel, channel-name column
- **observation:** The channel name column is 64px wide with `overflow: hidden; text-overflow: ellipsis`. "Paid Search" renders as "Paid Se..." and "Paid Social" renders as "Paid So..." — both truncated to the same visible prefix, making them indistinguishable without hovering. No tooltip is provided for the truncated names.
- **why it matters:** The marketer's job is to name the best and worst channel. If two channels are truncated to identical-looking labels, the user cannot tell them apart at a glance, and the brief's success criterion — "name the best and worst channel" — cannot be reliably met from a quick scan.
- **suggested direction:** Widen the name column (the panel has room at 1280px), or allow channel names to wrap to two lines rather than truncate. At minimum, add `title` attributes so hovering reveals the full name.

---

### F5 — ROAS KPI card omits the "% reached" consistency the other three cards have

- **severity:** low
- **principle:** consistency
- **scope:** "Return on ad spend" KPI card
- **observation:** The Revenue, Ad Spend, and New Customers cards all show a percentage-of-target line ("94% reached," "90% used"). The ROAS card shows only "Target $3.50 per $1 spent" — no percentage of achievement — even though the underlying ratio is computed (ratio = roas / roasTarget).
- **why it matters:** The persona scans four cards in a row expecting the same pattern. The missing "% reached" on ROAS breaks the rhythm and forces a mental calculation ("$3.70 vs $3.50, is that good?") that the other cards spare them. Minor, but works against the "at a glance" goal.
- **suggested direction:** Add "106% of target reached" (or equivalent) to the ROAS `targetText` in `renderKpi`, matching the pattern used by the other three cards.
