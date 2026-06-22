# UX Review — Brightline Marketing: Campaign Performance

## Goal (as understood)
A non-technical marketing manager, in a hurry, sits down to read this month's campaign
results and within seconds wants to state overall revenue vs target, name the best/worst
channel, and tell whether they're on track — in plain language, with clear visual cues and
a visible data-freshness timestamp.
Reviewed on: desktop ~1280px (primary target). Date-range states 7 / 30 / 90 days all checked.

## What's working
1. **Plain-language headline and labels.** The summary sentence ("you brought in $391,000 —
   you're behind target (94% of your $414,000 goal); Email is your strongest channel; Display
   needs attention") tells the story instead of dumping metrics. KPI names avoid jargon
   ("New customers", "Return on ad spend"), with `?` tooltips defining each. This squarely
   serves the persona.
2. **Data-freshness label is present and prominent** ("Data as of Jun 22, 2026, 8:00 AM") in
   the top bar, satisfying the brief's trust/freshness requirement.
3. **Single-screen, fast-encoding layout.** KPIs + trend (line) + channel bars all fit one
   viewport with no scrolling; chart types match their questions (line for trend, bar for
   channel comparison). Each KPI carries target and prior-period context.

## Findings (worst first)

### 1. The same "on-track" status is shown in two contradictory colors
- **severity:** high
- **principle:** consistency / clarity (the brief's central on-track cue)
- **scope:** cross-screen (headline vs. Revenue KPI card vs. trend sub-copy)
- **observation:** On the 30-day view (`01-overview-full.png`, `01-kpis.png`), revenue at
  94% of goal is described in the headline as **"behind target"** in **red** text, but the
  Revenue KPI card's progress bar for the *same number* is **amber** ("close to target"),
  and the trend panel's sub-line says yesterday was **"above the daily target"**. Three
  components give three different on-track signals for one period. Root cause in source: the
  headline uses thresholds `>=1 on track / >=0.95 just under / else behind`, while the KPI
  bars use `statusFor` with `>=1 good / >=0.9 warn / else bad` — so 0.90–0.95 is "behind" in
  words but "amber/close" in color.
- **why it matters:** "Am I on track?" is the persona's primary question and the brief's
  headline success criterion. When the word says behind, the bar says close, and the chart
  says above, the marketer cannot confidently answer it — exactly the "do the interpretation
  for me" promise the brief makes, broken.
- **suggested direction:** Drive every status (headline phrase, KPI bar color, trend copy)
  from one shared threshold function so 94% reads the same everywhere. Align the headline's
  "behind/just under/on track" bands with the good/warn/bad color bands.

### 2. The legend promises three channel states but only two ever appear
- **severity:** medium
- **principle:** consistency / discoverability
- **scope:** legend + "How each channel is doing" panel
- **observation:** The legend (`02-legend.png`) defines three colors: green "Ahead of
  target", amber "Close to target", red "Behind target". But the channel breakdown
  (`02-channels.png`) only ever renders green or red across all five channels and all three
  date ranges — Organic at perf 1.04 and Email at 1.21 are both flat green; no channel is
  ever amber. The amber legend entry corresponds to nothing on screen.
- **why it matters:** A legend that advertises a state the data never shows makes the
  persona hunt for a "close" channel that doesn't exist, and erodes trust that the colors
  mean what they say. It also flattens nuance — a channel 4% above target looks identical to
  one 21% above.
- **suggested direction:** Either apply the warn band to channels too (so near-target
  channels read amber) or drop the unused legend entry. Ensure the legend only lists states
  the view can actually produce.

### 3. The per-channel target marker is too faint to read "how far off"
- **severity:** medium
- **principle:** clarity / visual encoding
- **scope:** "How each channel is doing" panel
- **observation:** Each channel bar has a thin 2px vertical target mark
  (`02-channels.png`). On green (ahead) channels the fill overshoots the mark; on red
  channels it falls short — but the mark is low-contrast against the colored fill and the
  light track, and there is no number for the gap. The status text ("Ahead/Behind target")
  is binary, so the persona cannot tell *by how much* Display (perf 0.66) is behind vs Paid
  Social (perf 0.83) — both just say "Behind target".
- **why it matters:** The brief asks the persona to "decide where to move budget." That
  decision needs magnitude (Display is far worse than Paid Social), but the view gives only
  a pass/fail color and an invisible marker, so the worst channel isn't distinguishable from
  a mildly-off one without reading raw revenue.
- **suggested direction:** Make the target marker high-contrast (e.g. a dark notch with a
  small "target" affordance) and add a "% of target" figure per row, so the gap is legible
  at a glance and channels rank by severity.

### 4. Trend sub-copy is static and contradicts the period status
- **severity:** medium
- **principle:** feedback / consistency
- **scope:** "Revenue over time" panel across date ranges
- **observation:** The trend caption ("Yesterday's revenue of **$15,100** was above the
  daily target of $13,800.") is identical on the 7-, 30-, and 90-day views
  (`03-trend-30d.png`, `03-trend-90d.png`, `probe-7d-full.png`) — it always reports the same
  single most-recent day regardless of window. On the 30/90-day views it cheerfully says
  "above target" while the headline for the same period says "behind target."
- **why it matters:** The persona reads the panel sub-line as the trend's takeaway. A
  caption that never changes with the range, and that says "above" while the period is
  "behind," is a mixed signal that makes the chart feel disconnected from the rest of the
  dashboard and undermines trust.
- **suggested direction:** Make the sub-line describe the selected window (e.g. "X of N days
  beat the daily target," or "the period is tracking 6% under the target line"), so it
  agrees with the headline and updates with the range control.

### 5. Return-on-ad-spend is frozen at $3.70 across every date range
- **severity:** medium
- **principle:** feedback / trust
- **scope:** ROAS KPI card across date ranges
- **observation:** Toggling 7 / 30 / 90 days leaves ROAS at exactly **$3.70** with
  **"+0.0% vs prior period"** every time (`01-kpis.png`, `probe-7d-kpis`,
  `03-range-90d.png`). In source, spend is a fixed 27% of revenue, so ROAS (revenue/spend)
  is mathematically constant — it cannot vary. Its delta arrow is also rendered green/up
  even though the change is 0.0%.
- **why it matters:** The brief's third task is to switch the window and "confirm the KPIs
  update consistently." A headline KPI that never moves — and shows a positive green arrow on
  a flat 0.0% — reads as a broken or stale tile to a marketer, denting trust in the whole
  dashboard precisely when they're testing whether the data is live.
- **suggested direction:** Vary the underlying spend/ROAS modeling so the figure responds to
  the window, and render a 0.0% delta as neutral (no green up arrow). At minimum, don't show
  a "good" colored arrow for a non-change.

### 6. KPI delta-arrow color encodes direction, not whether it's good news
- **severity:** low
- **principle:** consistency / color meaning
- **scope:** KPI card deltas
- **observation:** Revenue, New customers and ROAS show a green up-arrow for "up"; Ad spend
  shows a red down-arrow for "down" because higher spend is treated as bad (`01-kpis.png`).
  The logic is sensible, but with no label the persona can't tell that green/red here mean
  "good/bad-for-this-metric" rather than simply "up/down" — and it sits next to a separate
  green/amber/red bar that means on-track status, so two different color systems share the
  card.
- **why it matters:** Minor, but two color languages on one card (delta good/bad vs. bar
  on-track) add a small interpretation tax for a non-technical, hurried reader.
- **suggested direction:** Keep one color meaning per card region, or add a one-word cue
  ("better"/"worse") so the delta color is self-explanatory.

---

### Notes / probes run
- Captured the three happy-path scenarios (01 overview, 02 channels, 03 range→90d) plus a
  7-day probe to confirm small-window behavior. All states render without error; the issues
  above are consistency/clarity, not crashes.
- Accessibility spot-check: status is carried by text *and* color in the KPI cards, channel
  rows, and headline (survives grayscale) — good. The exception is finding #3's faint target
  marker, where magnitude relies on a low-contrast visual alone.
