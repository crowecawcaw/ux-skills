## Goal (as understood)

A non-technical marketing manager lands on a single-page dashboard to read overall campaign revenue vs. target, spot the best and worst channels, and check whether the period is on track — all in seconds, in plain language, with visible data freshness. Reviewed on: desktop 1280×900 (primary device per brief).

---

## What's working

1. **Headline summary delivers the core job immediately.** On cold load the persona can read revenue, on-track status, strongest and weakest channel in one sentence. Plain-language, no jargon, updates when the date range changes.
2. **Data freshness is always visible.** The "Data as of Jun 22, 2026, 8:00 AM" label is persistent in the top-right on every range, satisfying the brief's trust requirement.
3. **Channel breakdown is scannable.** Color-coded bars plus text status labels ("Ahead of target" / "Behind target") give two redundant signals per channel, so color-blind users and fast scanners can both read it. The target marker (thin vertical line) correctly shifts relative to each bar.

---

## Findings (worst first)

### 1. Ad Spend delta arrow directly contradicts its value sign

- **severity:** high
- **principle:** consistency / feedback
- **scope:** KPI cards — Ad Spend card, all date ranges
- **observation:** The Ad Spend delta reads "▼ +6.6% vs prior period" in red. The downward arrow (▼) signals a decrease; the positive sign (+6.6%) signals an increase. Both cannot be true. The code correctly colors the text red (a spend increase is bad for this metric), but the arrow glyph is drawn from the "down = bad" class rather than tracking the actual direction of change. The result is a symbol (▼) and a number (+6.6%) that contradict each other on the same line.
- **why it matters:** The persona is non-technical and in a hurry. The arrow is the first thing the eye reads at a glance. If the arrow says "went down" but the number says "+6.6%", the marketer either mistrusts the number or misreads their spend trajectory — neither of which they can afford when making budget decisions.
- **suggested direction:** Decouple arrow direction from performance direction. Always point the arrow to match the actual change sign (▲ for positive, ▼ for negative); use color separately to signal whether that change is good or bad. "▲ +6.6% vs prior period" in red is unambiguous: spend went up (arrow) and that's bad (color).

---

### 2. Revenue KPI bar color conflicts with headline status text for the same metric

- **severity:** medium
- **principle:** consistency
- **scope:** KPI row + headline — cross-screen, most visible at 30-day and 7-day ranges
- **observation:** At 30 days, revenue is 94% of target. The headline calls this "**behind target**" and renders the phrase in red. The Revenue KPI bar shows amber (the "Close to target" / warn color). The same performance level is described as "behind" by one element and shown as "close" by another because the two components use different thresholds: the headline switches to "behind" below 95%, while the bar switches to red (bad) below 90%. The bar amber color actively contradicts the headline's red "behind target" label.
- **why it matters:** The persona's core question is "are we on track?" Two prominent elements on the same screen give different answers to that question for the same metric. This forces the marketer to do interpretation work the dashboard was supposed to spare them — exactly the pain point the brief identifies.
- **suggested direction:** Align the headline threshold and the KPI bar threshold to the same breakpoints, so the same performance level produces the same signal in both places. The simplest fix is a single shared `statusFor()` call that feeds both the bar color and the headline phrase.

---

### 3. Trend chart x-axis labels are illegible at 30-day and 90-day ranges

- **severity:** medium
- **principle:** clarity / legibility
- **scope:** Revenue over time chart — 30-day and 90-day views
- **observation:** The chart renders one x-axis label per day across the full date range. At 30 days, 30 labels are squeezed into approximately 580px of chart width (~19px each), producing complete overlap — the axis reads as a continuous band of garbled text ("May24May25May26…Jun 3un 4un 5un…"). At 90 days it is worse. The 7-day view is the only range where the axis is legible.
- **why it matters:** The trend chart exists so the marketer can identify when revenue dipped or spiked — which channel to look at, whether a dip was a one-time event. An unreadable x-axis removes the ability to locate events in time, making the chart usable only as a rough shape without any dateable reference points.
- **suggested direction:** Thin the labels: at 30 days show roughly weekly markers (every 7th day, e.g. "May 24", "May 31", "Jun 7"); at 90 days show monthly or bi-weekly markers. The 7-day view already uses this spacing naturally and is perfectly readable.

---

### 4. Legend scope is ambiguous — applies to both KPI bars and channel bars but sits only near the panels

- **severity:** low
- **principle:** discoverability / clarity
- **scope:** Legend — between KPI row and bottom panels
- **observation:** The legend ("Ahead of target / Close to target / Behind target") is positioned between the KPI cards and the channel/trend panels. The same three-color encoding (green/amber/red) is used by KPI progress bars above the legend and channel bars below it. The legend's location implies it explains only the panels below it; a first-time user reading the KPI cards before reaching the legend has no key for the bar colors.
- **why it matters:** For a persona who checks the dashboard infrequently, the KPI bar color has no label at the moment they encounter it. It's a minor friction point — the legend is only a short distance away and the channel bars below repeat the encoding with text labels — but it introduces a moment of uncertainty at the most decision-critical part of the page.
- **suggested direction:** Move the legend to sit directly below the KPI cards (before the panel grid), or add a brief inline label such as "bar = % of target" to each KPI card's progress bar. Either change places the key adjacent to where the persona first encounters the encoding.
